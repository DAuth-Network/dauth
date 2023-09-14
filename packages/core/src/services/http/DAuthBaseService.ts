import axios, { AxiosResponse, AxiosInstance } from 'axios'
import { decrypt, encrypt } from '../../utils/crypto'
import { IDauthConfig } from '../../types'
import { genKey } from '../../utils/curve'
import { p256 } from '@noble/curves/p256';
import * as utils from '@noble/curves/abstract/utils';


export default class DAuthBaseService {
    instance: AxiosInstance
    session_id = ''
    shareKey = ''

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

    public createChanel = async (fresh = true) => {
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
}
