export declare function encrypt(rawText: string, key: string): Promise<string | undefined>;
export declare function decrypt(secretText: string, key: string): string | undefined;
export declare function hashStr(cond: string): string;
