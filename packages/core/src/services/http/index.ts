import axios, { AxiosResponse, AxiosInstance } from 'axios'
import * as elliptic from 'elliptic'
import { decrypt, encrypt } from '../../utils/crypto'
import { IDauthConfig, IOtpConfirmReturn, TAccount_type, TOAuth_type, TSign_mode } from '../../types'

const EC = elliptic.ec
export class DAuthHttpService {
    private instance: AxiosInstance
    private session_id = ''
    private shareKey = ''

    constructor(dauthConfig: IDauthConfig) {
        this.instance = axios.create({
            baseURL: dauthConfig.baseURL,
        })
        this.instance.interceptors.request.use(
            config => {
                config.data = {
                    client_id: dauthConfig.clientID || 'demo',
                    ...config.data,

                }
                return config;
            }
        )

        this.instance.interceptors.response.use(
            (response) => {
                console.log(response)
                if (response.data.status === 'success') {
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
    private createChanel = async (fresh = true) => {
        if (!fresh) {
            return { session_id: this.session_id, shareKey: this.shareKey }
        }
        const { localPubKey, localKeyPair } = await this.genKey()
        const { session_id, key } = await this.exchangeKey(localPubKey)
        const ec = new EC('p256')

        const remoteKeyObj = ec.keyFromPublic(`04${key}`, 'hex')
        const bn = localKeyPair.derive(remoteKeyObj.getPublic())
        const origShareKey = bn.toString(16)
        const shareKey = origShareKey.slice(origShareKey.length / 2)
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
    async exchangeKeyAndEncrypt(rawText: string, fresh = true) {
        const { session_id, shareKey } = await this.createChanel(fresh)
        const cipher_str = await encrypt(rawText, shareKey)
        return { session_id, cipher_str }
    }
    async exchangeKeyAndDecrypt(cipherText: string) {
        const { session_id, shareKey } = await this.createChanel()
        const originalText = await decrypt(cipherText, shareKey)
        return { session_id, originalText: originalText }
    }


    async authOauth({ token, request_id, auth_type, mode }: { token: string; request_id: string, auth_type: TOAuth_type, mode: TSign_mode }): Promise<any> {
        const { session_id, cipher_str: cipher_code } = await this.exchangeKeyAndEncrypt(token)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                auth_type,
                cipher_code,
                session_id,
                request_id,
                sign_mode: mode
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: mode === 'jwt' ? originalText: JSON.parse(originalText!)
        }
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
        const originalText = decrypt(response.data.data, this.shareKey)
        return JSON.parse(originalText!)
    }
    async authOptConfirm({ code, request_id, mode }: { code: string; request_id: string, mode: TSign_mode }): Promise<any> {
        const { session_id, cipher_str: cipher_code } = await this.exchangeKeyAndEncrypt(code, false)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_code,
                session_id,
                request_id,
                sign_mode: mode
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: mode === 'jwt' ? originalText: JSON.parse(originalText!)
        }
    }
}
