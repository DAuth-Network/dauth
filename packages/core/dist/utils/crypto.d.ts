export declare function encrypt(rawText: string, key: string): Promise<any>;
export declare function decrypt(secretText: string, key: string): any;
export declare function hashStr(cond: string): any;
export declare function hashAndEncrypt(rawText: string, key: string): Promise<any>;
export declare function exchangeKeyAndEncrypt(rawText: string): Promise<{
    session_id: any;
    cipher_code: any;
}>;
