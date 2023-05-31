export interface IOtpConfirmReturn {
    auth: {
        account: string,
        auth_type: string,
        request_id: string
    }
    signature: string
}
export type TAccount_type = 'email' | 'sms'
export type TOAauth_type = 'google' | 'github'