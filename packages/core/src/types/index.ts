export interface IOtpConfirmReturn {
    auth: {
        account: string,
        auth_type: string,
        request_id: string
    }
    signature: string
}
export type TAccount_type = 'email' | 'sms'
export type TAuth_type = 'google' | 'github' | 'apple' | 'email' | 'sms'
export type TSign_mode = 'jwt' | 'proof'
export interface IDauthConfig {
    baseURL: string,
    clientID: string,
}