import axios, { AxiosResponse, AxiosInstance } from 'axios'
import * as elliptic from 'elliptic'
import { decrypt, encrypt } from '../../utils/crypto'
import { IOtpConfirmReturn, TAccount_type, TOAauth_type } from '../../types'

const EC = elliptic.ec
export class DAuthHttpService {
    private instance: AxiosInstance
    private session_id = ''
    private shareKey = ''

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL: baseURL,
        })
        this.instance.interceptors.request.use(
            config => {
                config.data = {
                    client_id: 'demo',
                    ...config.data,

                }
                return config;
            }
        )

        this.instance.interceptors.response.use(
            (response) => {
                if (response.data.status === 'succ') {
                    return response
                } else {
                    return Promise.reject(response.data.error_msg)
                }
            },
            (error) => {
                if (error.response) {
                    console.log('Status:', error.response.status)
                    console.log('Data:', error.response.data)
                } else if (error.request) {
                    console.log('No response from server.')
                } else {
                    console.log('Error:', error.message)
                }
                return Promise.reject(error)
            }
        )
    }
    private genKey = async () => {
        const ec = new EC('p256')
        const localKeyPair = ec.genKeyPair()
        const localPubKey = (localKeyPair.getPublic() as any).encode('hex')
        return {
            localPubKey,
            localKeyPair,
        }
    }
    private createChanel = async () => {
        if (this.session_id && this.shareKey) {
            return { session_id: this.session_id, shareKey: this.shareKey }
        }
        const { localPubKey, localKeyPair } = await this.genKey()
        const { session_id, key } = await this.exchangeKey(localPubKey)
        console.log("session_id, key", session_id, key)
        const ec = new EC('p256')
        console.log("", `0x${key}`)

        const remoteKeyObj = ec.keyFromPublic(`0x${key}`, 'hex')
        const bn = localKeyPair.derive(remoteKeyObj.getPublic())
        const origShareKey = bn.toString(16)
        const shareKey = origShareKey.slice(origShareKey.length / 2)
        console.log(shareKey, origShareKey)
        this.session_id = session_id
        this.shareKey = shareKey
        return { session_id, shareKey }
    }
    exchangeKey = async (key: string): Promise<{ key: string, session_id: string }> => {
        try {
            const response: AxiosResponse = await this.instance.post(`/exchange_key`, { key })
            return response.data.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    async exchangeKeyAndEncrypt(rawText: string) {
        const { session_id, shareKey } = await this.createChanel()
        const cipher_str = await encrypt(rawText, shareKey)
        return { session_id, cipher_str }
    }
    async exchangeKeyAndDecrypt(cipherText: string) {
        const { session_id, shareKey } = await this.createChanel()
        const orignalText = await decrypt(cipherText, shareKey)
        return { session_id, orignalText }
    }
    async authOpt({ account, account_type, request_id }: { account: string; account_type: TAccount_type; request_id: string }): Promise<any> {
        const { session_id, cipher_str: cipher_account } = await this.exchangeKeyAndEncrypt(account)
        const response: AxiosResponse = await this.instance.post(`/auth_otp`,
            {
                cipher_account,
                session_id,
                account_type,
                request_id
            })
        return response.data
    }
    // async authOptConfirm({ code, request_id }: { code: string; request_id: string }): Promise<IOtpConfirmReturn> {
    //     const { session_id, cipher_str: cipher_code } = await this.exchangeKeyAndEncrypt(code)
    //     const response: AxiosResponse = await this.instance.post(`/auth_otp_confirm`,
    //         {
    //             cipher_code,
    //             session_id,
    //             request_id
    //         })
    //     const orignalText = decrypt(response.data.data, this.shareKey)
    //     return JSON.parse(orignalText!)
    // }
    async authOauth({ token, request_id, auth_type }: { token: string; request_id: string, auth_type: TOAauth_type }): Promise<IOtpConfirmReturn> {
        const { session_id, cipher_str: cipher_code } = await this.exchangeKeyAndEncrypt(token)
        const response: AxiosResponse = await this.instance.post(`/auth_oauth`,
            {
                cipher_code,
                session_id,
                request_id,
                auth_type
            })
        const orignalText = decrypt(response.data.data, this.shareKey)
        return JSON.parse(orignalText!)
    }
    async sendOtp({ account, request_id, account_type }: { account: string; account_type: TAccount_type, request_id?: string, }): Promise<IOtpConfirmReturn> {
        const { session_id, cipher_str: cipher_account } = await this.exchangeKeyAndEncrypt(account)
        const response: AxiosResponse = await this.instance.post(`/send_otp`,
            {
                cipher_account,
                session_id,
                request_id,
                account_type
            })
        const orignalText = decrypt(response.data.data, this.shareKey)
        return JSON.parse(orignalText!)
    }
    async authOptConfirm({ code, request_id }: { code: string; request_id: string }): Promise<IOtpConfirmReturn> {
        const { session_id, cipher_str: cipher_code } = await this.exchangeKeyAndEncrypt(code)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_code,
                session_id,
                request_id,
                sign_mode : "jwt"  
            })
        const orignalText = decrypt(response.data.data, this.shareKey)
        return JSON.parse(orignalText!)
    }
}
