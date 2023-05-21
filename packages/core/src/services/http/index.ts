import axios, {  AxiosResponse, AxiosInstance } from 'axios'
import * as elliptic from 'elliptic'
import { encrypt } from '../../utils/crypto'

const EC = elliptic.ec
interface RequestPayload {
    [key: string]: any
}

interface ResponsePayload<T> {
    data: T
    status: string
}

// Exchange key
interface exchangeKeyRequestPayload {
    key: string
}

export class DAuthHttpService {
    private instance: AxiosInstance
    private session_id = ''
    private shareKey = ''

    constructor(baseURL = "https://dev-api.dauth.network/dauth/sdk/v1/") {
        this.instance = axios.create({
            baseURL: baseURL,
        })
        this.instance.interceptors.request.use(
            config => {
                config.data = {
                    ...config.data,

                }
                return config;
            }
        )

        this.instance.interceptors.response.use(
            (response) => {
                if (response.data.status !== 'fail') {
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
        const res = await this.exchangeKey({ key: localPubKey })

        const { session_id, key } = res
        const ec = new EC('p256')
        const remoteKeyObj = ec.keyFromPublic(key, 'hex')
        const bn = localKeyPair.derive(remoteKeyObj.getPublic())
        const origShareKey = bn.toString(16)
        const shareKey = origShareKey.slice(origShareKey.length / 2)
        this.session_id = session_id
        this.shareKey = shareKey
        return { session_id, shareKey }
    }
    exchangeKey = async (payload: exchangeKeyRequestPayload): Promise<any> => {
        try {
            const response: AxiosResponse = await this.instance.post(`/exchange_key`, payload)
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    async exchangeKeyAndEncrypt(rawText: string) {
        const { session_id, shareKey } = await this.createChanel()
        const cipher_str = await encrypt(rawText, shareKey)
        return { session_id, cipher_str }
    }
    authEmail = async (code: string): Promise<any> => {
        try {
            const { session_id, cipher_str: cipher_email } = await this.exchangeKeyAndEncrypt(code)
            const response: AxiosResponse = await this.instance.post(`/auth_email`, { cipher_email, session_id })
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    async confirmAuthEmail(code: string): Promise<any> {
        try {
            const { session_id, cipher_str: cipher_code } = await this.exchangeKeyAndEncrypt(code)
            const response: AxiosResponse = await this.instance.post(`/auth_email_confirm`, { cipher_code, session_id })
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}
