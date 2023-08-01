export interface IOtpConfirmReturn {
    auth: {
        acc_and_type_hash: string,
        request_id: string
    }
    signature: string,
    ustore?:
    {
        user_key: "",
        user_key_sealed: "",
        user_key_signed: ""
    }
}
export type TAccount_type = 'mailto' | 'tel'
export type TID_type = 'google' | 'github' | 'apple' | 'twitter' | 'mailto' | 'tel'
export type TSign_mode = 'jwt' | 'proof' | 'jwtfb' | 'both'
export enum ESignMode {
    JWT = "jwt",
    PROOF = "proof",
    JWT_FIREBASE = "jwtdb",
    BOTH = "both"
}
export interface IDauthConfig {
    baseURL: string,
    clientID: string,
}