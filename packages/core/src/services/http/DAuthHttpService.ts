import { AxiosResponse } from 'axios'
import { decrypt } from '../../utils/crypto'
import { ESignMode, TAccount_type, TID_type } from '../../types'
import DAuthBaseService from './DAuthBaseService';
import { parseData } from '../../utils';


class DAuthHttpService extends DAuthBaseService {
    
    async authOauth({ token, request_id, id_type, mode, withPlainAccount }: {
        token: string;
        request_id: string,
        id_type: TID_type,
        mode: ESignMode,
        withPlainAccount?: boolean
    }): Promise<any> {
        const { session_id, cipher_data: cipher_code } = await this.exchangeKeyAndEncrypt(token)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                code: token,
                id_type,
                cipher_code,
                session_id,
                request_id,
                sign_mode: mode,
                withPlainAccount
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
        const { session_id, cipher_data: cipher_account } = await this.exchangeKeyAndEncrypt(account)
        await this.instance.post(`/send_otp`,
            {
                cipher_account,
                session_id,
                request_id,
                id_type,
            })
        return true

    }

    async authOtpConfirm({ code, request_id, mode, id_type, withPlainAccount }: {
        code: string;
        request_id: string,
        mode: ESignMode,
        id_type: TID_type,
        withPlainAccount?: boolean
    }): Promise<any> {
        const { session_id, cipher_data: cipher_code } = await this.exchangeKeyAndEncrypt(code, false)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_code,
                session_id,
                request_id,
                sign_mode: mode,
                id_type,
                account_plain: withPlainAccount
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: parseData(originalText)
        }
    }
    async authOtpConfirmAndGenerateKey({ code, request_id, mode, id_type, withPlainAccount }: {
        code: string;
        request_id: string,
        mode: ESignMode,
        id_type: TID_type,
        withPlainAccount?: boolean,
    }): Promise<any> {
        const { session_id, cipher_data: cipher_code } = await this.exchangeKeyAndEncrypt(code, false)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_code,
                session_id,
                request_id,
                sign_mode: mode,
                id_type,
                account_plain: withPlainAccount,
                user_key: ""
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
        const { session_id, cipher_data: cipher_code } = await this.exchangeKeyAndEncrypt(code, false)
        const response: AxiosResponse = await this.instance.post(`/auth_in_one`,
            {
                cipher_code,
                session_id,
                request_id,
                sign_mode: mode,
                id_type,
                user_key_signature,
                user_key,
                account_plain: withPlainAccount,
            })
        const originalText = decrypt(response.data.data, this.shareKey)
        return {
            mode,
            data: parseData(originalText)
        }
    }
}

export default DAuthHttpService