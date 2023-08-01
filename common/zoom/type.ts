export type ZoomUserResponse = {
    page_count: number;
    page_number: number;
    page_size: number;
    total_recoreds: number;
    next_page_token?: number;
    users: ZoomUserInfo[];
};

type CustomAttribute = {
    key: string;
    name: string;
    value: string;
};

type ZoomUserInfo = {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string;
    email: string;
    type: number;
    pmi: number;
    timezone: string;
    verified: number;
    dept: string;
    created_at: string;
    last_login_time: string;
    last_client_version: string;
    group_ids: string[];
    custom_attributes: CustomAttribute[];
    employee_unique_id: string;
    language: string;
    status: string;
    role_id: string;
    user_created_at: string;
};

export type ZoomUserType = Pick<ZoomUserInfo, 'id' | 'first_name' | 'last_name' | 'email' | 'type' | 'status' | 'role_id'>;
