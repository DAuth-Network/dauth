import axios from 'axios';
const baseURL = 'https://dev-api.dauth.network/dauth/sdk/v1/';
const instance = axios.create({
    baseURL,
});
instance.interceptors.request.use(config => {
    config.data = {
        ...config.data,
        client_id: 'demo',
    };
    return config;
});
instance.interceptors.response.use((response) => {
    if (response.data.status !== 'fail') {
        return response;
    }
    else {
        return Promise.reject(response.data.error_msg);
    }
}, (error) => {
    if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
    }
    else if (error.request) {
        console.log('No response from server.');
    }
    else {
        console.log('Error:', error.message);
    }
    return Promise.reject(error);
});
export const dauth_exchangeKey = async (payload) => {
    try {
        const response = await instance.post(`/exchange_key`, payload);
        return response.data;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const dauth_registerEmail = async (payload) => {
    try {
        const response = await instance.post(`/auth_email`, payload);
        return response.data;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const dauth_confirmRegisteredEmail = async (payload) => {
    try {
        const response = await instance.post(`/auth_email_confirm`, payload);
        return response.data;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const dauth_getUserInfo = async () => {
    try {
        const response = await instance.get(`/info`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const loginWithOauth = async (data) => {
    try {
        const response = await instance.post(`/auth_oauth`, data, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
