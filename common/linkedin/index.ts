import { prisma } from '../prisma';
import axios, { AxiosInstance } from 'axios';
import { URL } from 'url';

// LinkedIn API Base URLs
const LINKEDIN_API_URLS = {
    BASE: 'https://api.linkedin.com',
    OAUTH: 'https://www.linkedin.com/oauth/v2',
    USER_INFO: '/v2/userinfo',
    IMAGE_UPLOAD: '/rest/images',
    POSTS: '/rest/posts',
};

// LinkedIn API Versions
const LINKEDIN_API_VERSIONS = {
    DEFAULT: '202410',
};

export interface LinkedInTokenCreate {
    userId: string;
    accessToken: string;
    expiresAt: Date;
}

export interface LinkedInPostCreate {
    userId: string;
    imageUrl: string;
    title?: string;
    description?: string;
    commentary?: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN' | 'CONTAINER';
    distribution?: {
        feedDistribution?: 'NONE' | 'MAIN_FEED';
        targetEntities?: any[];
        thirdPartyDistributionChannels?: string[];
    };
    isReshareDisabledByAuthor?: boolean;
}

export interface LinkedInAuthResponse {
    access_token: string;
    expires_in: number;
    id_token?: string;
}

interface LinkedInUserInfo {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture?: string;
    locale: string;
    email?: string;
    email_verified?: boolean;
}

interface LinkedInImageUploadResponse {
    uploadUrlExpiresAt: number;
    uploadUrl: string;
    image: string;
}

const createLinkedInClient = (accessToken: string): AxiosInstance => {
    return axios.create({
        baseURL: LINKEDIN_API_URLS.BASE,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'LinkedIn-Version': LINKEDIN_API_VERSIONS.DEFAULT,
            'X-RestLi-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
        },
        timeout: 30000,
    });
};

const isValidUrl = (urlString: string): boolean => {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
};

const fetchLinkedInProfileId = async (accessToken: string): Promise<string> => {
    try {
        const client = createLinkedInClient(accessToken);
        const response = await client.get(LINKEDIN_API_URLS.USER_INFO);

        const data: LinkedInUserInfo = response.data;
        return `urn:li:person:${data.sub}`; // Convert sub to full URN
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`LinkedIn API error: ${error.response?.data || error.message}`);
        }
        throw error;
    }
};

export const initializeImageUpload = async (accessToken: string, personUrn?: string): Promise<LinkedInImageUploadResponse> => {
    const client = createLinkedInClient(accessToken);

    // If personUrn is not provided, fetch it from the access token
    const owner = personUrn || (await fetchLinkedInProfileId(accessToken));

    try {
        const response = await client.post(`${LINKEDIN_API_URLS.IMAGE_UPLOAD}?action=initializeUpload`, {
            initializeUploadRequest: {
                owner: owner,
            },
        });

        return response.data.value;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error initializing LinkedIn image upload:', error.response?.data || error.message);
            throw new Error(`LinkedIn image upload initialization failed: ${error.response?.data || error.message}`);
        }
        throw error;
    }
};

export const getLinkedInAccessToken = async (code: string, redirectUri: string, clientId: string, clientSecret: string): Promise<LinkedInAuthResponse> => {
    try {
        const response = await axios.post(
            `${LINKEDIN_API_URLS.OAUTH}/accessToken`,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 10000,
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`LinkedIn OAuth error: ${error.response?.data || error.message}`);
        }
        throw error;
    }
};

export const saveLinkedInToken = async (input: LinkedInTokenCreate) => {
    const { userId, accessToken, expiresAt } = input;
    return await prisma.linkedInToken.upsert({
        where: { userId },
        update: { accessToken, expiresAt },
        create: { userId, accessToken, expiresAt },
    });
};

export const postImageToLinkedIn = async (input: LinkedInPostCreate) => {
    const {
        userId,
        imageUrl,
        title,
        commentary,
        visibility = 'PUBLIC',
        distribution = {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: [],
        },
        isReshareDisabledByAuthor = false,
    } = input;

    // Validate image URL
    if (!isValidUrl(imageUrl)) {
        throw new Error(`Invalid image URL: ${imageUrl}`);
    }

    // Get LinkedIn access token
    const tokenData = await prisma.linkedInToken.findUnique({ where: { userId } });
    if (!tokenData) {
        throw new Error('No LinkedIn access token found for this user');
    }

    try {
        const client = createLinkedInClient(tokenData.accessToken);

        // Fetch LinkedIn Profile ID
        const linkedInProfileId = await fetchLinkedInProfileId(tokenData.accessToken);

        // Initialize image upload
        const { image: imageUrn, uploadUrl } = await initializeImageUpload(tokenData.accessToken, linkedInProfileId);

        // Download image
        let imageResponse;
        try {
            imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        } catch (error) {
            console.error(`Failed to download image from URL: ${imageUrl}`, error);
            throw new Error(`Failed to download image from URL: ${imageUrl}`);
        }

        // Upload the image binary
        try {
            console.log('Uploading image to LinkedIn...');
            console.log('Image URN:', imageUrn);
            const uploadResponse = await axios.put(uploadUrl, imageResponse.data, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    Authorization: `Bearer ${tokenData.accessToken}`,
                },
                timeout: 60000,
            });
            console.log(uploadResponse.data);
        } catch (error) {
            console.error('Failed to upload image to LinkedIn', error);
            throw new Error('Failed to upload image to LinkedIn');
        }
        console.log('Image uploaded successfully!');
        // Create the post with the image
        const postResponse = await client.post(LINKEDIN_API_URLS.POSTS, {
            author: linkedInProfileId,
            commentary: commentary || 'Check out this image!',
            visibility: visibility,
            distribution: distribution,
            content: {
                media: {
                    id: imageUrn,
                    title: title,
                    altText: title || 'Shared Image',
                },
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: isReshareDisabledByAuthor,
        });
        console.log('LinkedIn post created:', postResponse.data);

        return true;
    } catch (error) {
        console.error('LinkedIn image post failed', error);
        throw error;
    }
};
