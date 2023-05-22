import { IOtpConfirmReturn, TAccount_type } from '../../types';
export declare class DAuthHttpService {
    private instance;
    private session_id;
    private shareKey;
    constructor(baseURL: string);
    private genKey;
    private createChanel;
    exchangeKey: (key: string) => Promise<{
        key: string;
        session_id: string;
    }>;
    exchangeKeyAndEncrypt(rawText: string): Promise<{
        session_id: string;
        cipher_str: string | undefined;
    }>;
    exchangeKeyAndDecrypt(cipherText: string): Promise<{
        session_id: string;
        orignalText: string | undefined;
    }>;
    authOpt(account: string, account_type: TAccount_type, request_id: string): Promise<any>;
    authOptConfirm(code: string, request_id: string): Promise<IOtpConfirmReturn>;
}
