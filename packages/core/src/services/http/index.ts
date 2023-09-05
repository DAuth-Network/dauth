import axios, { AxiosResponse, AxiosInstance } from 'axios'
import { decrypt, encrypt } from '../../utils/crypto'
import { ESignMode, IDauthConfig, TAccount_type, TID_type } from '../../types'
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
        const cipher_data = await encrypt(rawText, shareKey)
        return { session_id, cipher_data }
    }

    async exchangeKeyAndDecrypt(cipherText: string) {
        const { session_id, shareKey } = await this.createChanel()
        const originalText = await decrypt(cipherText, shareKey)
        return { session_id, originalText: originalText }
    }


    async authOauth({ token, request_id, id_type, mode, withPlainAccount }: {
        token: string;
        request_id: string,
        id_type: TID_type,
        mode: ESignMode,
        withPlainAccount?: boolean
    }): Promise<any> {
        const data = {
            id_type,
            token,
            request_id,
            sign_mode: mode,
            withPlainAccount
        }
        const { session_id, cipher_data } = await this.exchangeKeyAndEncrypt(JSON.stringify(data))
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                session_id,
                cipher_data
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: parseData(originalText)
        }
    }

    async sendOtp({ account, request_id, id_type }: {
        account: string;
        id_type: TAccount_type,
        request_id?: string,
    }): Promise<boolean> {
        const data = JSON.stringify({
            account,
            request_id,
            id_type,
        })
        const { session_id, cipher_data } = await this.exchangeKeyAndEncrypt(data)
        await this.instance.post(`/send_otp`,
            {
                session_id,
                cipher_data
            })
        return true

    }

    async authOtpConfirmAndGenerateKey({ code, request_id, mode, id_type, withPlainAccount }: {
        code: string;
        request_id: string,
        mode: ESignMode,
        id_type: TID_type,
        withPlainAccount?: boolean,
    }): Promise<any> {
        const data = JSON.stringify({
            code,
            request_id,
            sign_mode: mode,
            id_type,
            account_plain: withPlainAccount,
            user_key: ""
        })
        const { session_id, cipher_data } = await this.exchangeKeyAndEncrypt(data, false)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_data,
                session_id,
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: parseData(originalText)
        }
    }
    async authOtpConfirmAndRecoverKey({ code, request_id, mode, id_type, user_key, user_key_signature, withPlainAccount }: {
        code: string;
        request_id: string,
        mode: ESignMode,
        id_type: TID_type,
        user_key: string,
        user_key_signature: string,
        withPlainAccount?: boolean,
    }): Promise<any> {
        const data = {
            code,
            request_id,
            sign_mode: mode,
            id_type,
            user_key_signature,
            user_key,
            account_plain: withPlainAccount,
        }
        const { session_id, cipher_data } = await this.exchangeKeyAndEncrypt(JSON.stringify(data), false)

        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_data,
                session_id,

            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: parseData(originalText)
        }
    }
    async authOtpConfirm({
        code,
        request_id,
        mode,
        id_type,
        user_key,
        user_key_signature,
        sign_msg,
        id_key_salt,
        withPlainAccount }: {
            code: string;
            request_id: string,
            mode: ESignMode,
            id_type: TID_type,
            user_key: string,
            user_key_signature: string,
            id_key_salt: number,
            sign_msg: string,
            withPlainAccount?: boolean,
        }): Promise<any> {
        const data = {
            code,
            request_id,
            sign_mode: mode,
            id_type,
            user_key_signature,
            user_key,
            account_plain: withPlainAccount,
            sign_msg,
            id_key_salt,
        }
        const { session_id, cipher_data } = await this.exchangeKeyAndEncrypt(JSON.stringify(data), false)

        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_data,
                session_id,
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: parseData(originalText)
        }
    }
}
function parseData(data_str?: string) {
    if (!data_str) {
        return ""
    }
    try {
        return JSON.parse(data_str)

    } catch (error) {
        return data_str
    }
}
