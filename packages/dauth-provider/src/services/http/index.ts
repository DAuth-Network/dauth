import axios, { AxiosResponse } from 'axios';
const baseURL = 'https://dev-api.dauth.network/dauth/sdk/v1';
const instance = axios.create({
    baseURL,
});

interface RequestPayload {
    [key: string]: any;
}

interface ResponsePayload<T> {
    data: T;
    status: string;
}
// Exchange key
interface exchangeKeyEequestPayload {
    key: string
   
}
instance.interceptors.response.use(
    (response) => {
        if (response.data.status !== 'fail') {
            return response
        } else {
            return Promise.reject(response.data.error_msg)
        }
    },
    (error) => {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else if (error.request) {
            console.log('No response from server.');
        } else {
            console.log('Error:', error.message);
        }
        return Promise.reject(error);
    }
);
export const dauth_exchangeKey = async (payload: exchangeKeyEequestPayload): Promise<any> => {
    try {
        const response: AxiosResponse = await instance.post(`/exchange_key`, payload);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Register email
interface registerEmailRequestPayload {

    cipher_email: string,
    session_id: string
}
export const dauth_registerEmail = async (payload: registerEmailRequestPayload): Promise<any> => {
    try {
        const response: AxiosResponse = await instance.post(`/auth_email`, payload);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Confirm registered email
interface registerEmailEequestPayload {

    cipher_code: string,
    session_id: string
}
export const dauth_confirmRegisteredEmail = async (payload: RequestPayload): Promise<any> => {
    try {
        const response: AxiosResponse = await instance.post(`/auth_email_confirm`, payload);
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get user info
export interface IProfileItem {
    auth_hash: string
    auth_id: string
    auth_signature: string
    auth_type: string
}

export const dauth_getUserInfo = async (): Promise<ResponsePayload<IProfileItem[]>> => {
    try {
        const response: AxiosResponse = await instance.get(`/info`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

interface ILoginWithOauthPayload {
    session_id: string
    cipher_code: string
    oauth_type: string
}
export const loginWithOauth = async (data: ILoginWithOauthPayload): Promise<ResponsePayload<any>> => {
    try {
        const response: AxiosResponse = await instance.post(`/auth_oauth`, data, {
            headers: {
                'Authorization': localStorage.getItem('token')
            },
        })
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};