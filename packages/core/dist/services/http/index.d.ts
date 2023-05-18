interface RequestPayload {
    [key: string]: any;
}
interface ResponsePayload<T> {
    data: T;
    status: string;
}
interface exchangeKeyEequestPayload {
    key: string;
}
export declare const dauth_exchangeKey: (payload: exchangeKeyEequestPayload) => Promise<any>;
interface registerEmailEequestPayload {
    cipher_email: string;
    session_id: string;
}
export declare const dauth_registerEmail: (payload: registerEmailEequestPayload) => Promise<any>;
export declare const dauth_confirmRegisteredEmail: (payload: RequestPayload) => Promise<any>;
export interface IProfileItem {
    auth_hash: string;
    auth_id: string;
    auth_signature: string;
    auth_type: string;
}
export declare const dauth_getUserInfo: () => Promise<ResponsePayload<IProfileItem[]>>;
interface ILoginWithOauthPayload {
    session_id: string;
    cipher_code: string;
    oauth_type: string;
}
export declare const loginWithOauth: (data: ILoginWithOauthPayload) => Promise<ResponsePayload<any>>;
export {};
