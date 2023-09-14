import { AxiosResponse } from 'axios'
import { decrypt } from '../../utils/crypto'
import { ESignMode, TAccount_type, TID_type } from '../../types'
import DAuthBaseService from './DAuthBaseService';


class DAuthHttpServiceV2 extends DAuthBaseService {

    async authOauth({ token, request_id, id_type, mode, sign_msg,
        id_key_salt, withPlainAccount }: {
            token: string;
            request_id: string,
            id_type: TID_type,
            mode: ESignMode,
            sign_msg: string,
            id_key_salt: number
            withPlainAccount?: boolean,

        }): Promise<any> {
        const data = {
            id_type,
            code: token,
            request_id,
            sign_mode: mode,
            sign_msg,
            id_key_salt,
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

    async authOtpConfirmAndGenerateKey({ code, request_id, mode, id_type, withPlainAccount, id_key_salt, sign_msg }: {
        code: string;
        request_id: string,
        mode: ESignMode,
        id_type: TID_type,
        id_key_salt?: number,
        sign_msg?: string,
        withPlainAccount?: boolean,

    }): Promise<any> {
        const data = {
            code,
            request_id,
            sign_mode: mode,
            id_type,
            account_plain: withPlainAccount,
            user_key: "",
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
    async authOtpConfirmAndRecoverKey({
        code,
        request_id,
        mode, id_type,
        user_key,
        user_key_signature,
        withPlainAccount,
        id_key_salt,
        sign_msg
    }: {
        code: string;
        request_id: string,
        mode: ESignMode,
        id_type: TID_type,
        user_key: string,
        user_key_signature: string,
        id_key_salt?: number,
        sign_msg?: string,
        withPlainAccount?: boolean,
    }): Promise<any> {
        const data = {
            code,
            request_id,
            sign_mode: mode,
            id_type,
            id_key_salt,
            sign_msg,
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
        withPlainAccount
    }: {
        code: string;
        request_id: string,
        mode: ESignMode,
        id_type: TID_type,
        id_key_salt?: number,
        sign_msg?: string,
        user_key?: string,
        user_key_signature?: string,
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
export default DAuthHttpServiceV2