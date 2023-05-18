import * as elliptic from 'elliptic';
declare class ExchangeKey {
    session_id: string;
    shareKey: string;
    genKey: () => Promise<{
        localPubKey: any;
        localKeyPair: elliptic.ec.KeyPair;
    }>;
    exchange: () => Promise<{
        session_id: any;
        shareKey: string;
    }>;
}
declare const _default: ExchangeKey;
export default _default;
