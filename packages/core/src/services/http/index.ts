import axios, { AxiosResponse, AxiosInstance } from 'axios'
import { decrypt, encrypt } from '../../utils/crypto'
import { IDauthConfig, TAccount_type, TAuth_type, TSign_mode } from '../../types'
import { genKey } from '../../utils/curve'
import { p256 } from '@noble/curves/p256';
import * as utils from '@noble/curves/abstract/utils';


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
                if (response.data.status === 'success') {
                    return response
                } else {
                    return Promise.reject(response.data.error_msg)
                }
            },
            (error) => {
                return Promise.reject(error)
            }
        )
    }

    private createChanel = async (fresh = true) => {
        if (!fresh) {
            return { session_id: this.session_id, shareKey: this.shareKey }
        }
        const { localPubKey, localPriv } = await genKey()
        const { session_id, key } = await this.exchangeKey(localPubKey)

        const origShareKey = p256.getSharedSecret(localPriv, `04${key}`).slice(1)
        const originalText = utils.bytesToHex(origShareKey)
        const shareKey = originalText.slice(originalText.length / 2)
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


    async authOauth({ token, request_id, auth_type, mode }: { token: string; request_id: string, auth_type: TAuth_type, mode: TSign_mode }): Promise<any> {
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
            data: mode === 'jwt' ? originalText : JSON.parse(originalText!)
        }
    }
    async sendOtp({ account, request_id, account_type }: { account: string; account_type: TAccount_type, request_id?: string, }): Promise<boolean> {
        const { session_id, cipher_str: cipher_account } = await this.exchangeKeyAndEncrypt(account)
        await this.instance.post(`/send_otp`,
            {
                cipher_account,
                session_id,
                request_id,
                account_type,
            })
        return true

    }
    async authOptConfirm({ code, request_id, mode, auth_type }: { code: string; request_id: string, mode: TSign_mode, auth_type?: TAuth_type }): Promise<any> {
        const { session_id, cipher_str: cipher_code } = await this.exchangeKeyAndEncrypt(code, false)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_code,
                session_id,
                request_id,
                sign_mode: mode,
                auth_type
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: mode === 'jwt' ? originalText : JSON.parse(originalText!)
        }
    }
}
