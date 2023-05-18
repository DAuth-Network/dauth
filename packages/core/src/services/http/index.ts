import axios, { Axios, AxiosResponse, AxiosInstance } from 'axios'

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


// Register email
interface registerEmailRequestPayload {
    cipher_email: string
    session_id: string
}






// Get user info
export interface IProfileItem {
    auth_hash: string
    auth_id: string
    auth_signature: string
    auth_type: string
}


interface ILoginWithOauthPayload {
    session_id: string
    cipher_code: string
    oauth_type: string
}


export class DAuthHttpService {
    private instance: AxiosInstance
    constructor(baseURL = "https://dev-api.dauth.network/dauth/sdk/v1/") {
        this.instance = axios.create({
            baseURL: baseURL,
        })
        this.instance.interceptors.request.use(
            config => {
                config.data = {
                    ...config.data,
                    client_id: 'demo',

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
    exchangeKey = async (payload: exchangeKeyRequestPayload): Promise<any> => {
        try {
            const response: AxiosResponse = await this.instance.post(`/exchange_key`, payload)
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    registerEmail = async (payload: registerEmailRequestPayload): Promise<any> => {
        try {
            const response: AxiosResponse = await this.instance.post(`/auth_email`, payload)
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    confirmRegisteredEmail = async (payload: RequestPayload): Promise<any> => {
        try {
            const response: AxiosResponse = await this.instance.post(`/auth_email_confirm`, payload)
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    loginWithOauth = async (
        data: ILoginWithOauthPayload
    ): Promise<ResponsePayload<any>> => {
        try {
            const response: AxiosResponse = await this.instance.post(`/auth_oauth`, data, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            return response.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}
