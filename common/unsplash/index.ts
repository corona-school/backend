interface SearchImagesResponse {
    total: number;
    totalPages: number;
    results: {
        id: string;
        description: string;
        regularImageUrl: string;
        smallImageUrl: string;
    }[];
}

interface SearchImagesRequest {
    search: string;
    page: number;
    take?: number;
}

export const searchUnsplashImages = async ({ search, page, take = 9 }: SearchImagesRequest): Promise<SearchImagesResponse> => {
    const data = await fetch(`https://api.unsplash.com/search/photos?query=${search}&page=${page}&per_page=${take}`, {
        method: 'GET',
        headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_CLIENT_ID}`,
        },
    });
    const response = await data.json();
    return {
        results: response?.results?.map((image) => ({
            id: image.id,
            description: image.alt_description,
            regularImageUrl: image.urls.regular,
            smallImageUrl: image.urls.small,
        })),
        total: response.total,
        totalPages: response.total_pages,
    };
};
