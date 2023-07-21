export interface IOtpConfirmReturn {
    auth: {
        account: string,
        id_type: TID_type,
        request_id: string
    }
    signature: string
}
export type TAccount_type = 'mailto' | 'tel'
export type TID_type = 'google' | 'github' | 'apple' | 'twitter' | 'mailto' | 'tel'
export type TSign_mode = 'jwt' | 'proof' | 'jwtfb' | 'both'
export enum ESignMode {
    JWT = "jwt",
    PROOF="proof",
    JWT_FIREBASE = "jwtdb",
    BOTH = "both"
}
export interface IDauthConfig {
    baseURL: string,
    clientID: string,
}