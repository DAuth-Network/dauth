import { cipher, util, md } from 'node-forge'

export async function encrypt(rawText: string, key: string) {
    console.log("encrypt content", rawText, " with ", key);
    if (key === "") {
        Promise.reject("Secure Channel to Dauth Node is not setup correctly. Please refresh page and try again.")
    }
    try {
        const aesKey = util.hexToBytes(key);
        const ciphers = cipher.createCipher('AES-GCM', aesKey);
        const iv = new Uint8Array(12) as any;
        ciphers.start({
            iv: iv,
            tagLength: 128
        });
        ciphers.update(util.createBuffer(rawText, 'raw'));
        console.log("finish.");
        ciphers.finish();
        const a = ciphers.output.toHex();
        const tag = ciphers.mode.tag;
        ciphers.output.getBytes();
        return tag.toHex() + a;
    } catch (err) {

        Promise.reject("Secure Channel to Dauth Node is not setup correctly. Please refresh page and try again.")
    }
}
export function decrypt(secretText: string, key: string) {
    //TODO: check if secretText is hex or binary
    if (key === "") {
        Promise.reject("Secure Channel to Dauth Node is not setup correctly. Please refresh page and try again.")
    }
    try {
        const aesKey = util.hexToBytes(key);
        // the first 16 bytes are for tag
        const tag = util.hexToBytes(secretText.slice(0, 32)) as any;
        // the remaining bytes are cipher_text 
        const rawText = util.hexToBytes(secretText.slice(32));
        const decipher = cipher.createDecipher('AES-GCM', aesKey);
        const iv = new Uint8Array(12) as any;
        decipher.start({
            iv: iv,
            tagLength: 128,
            tag: tag
        });
        decipher.update(util.createBuffer(rawText, 'raw'));
        decipher.finish();
        const a = decipher.output.toHex();
        console.log("decrypted hex ", a);
        const o = decipher.output.data;
        console.log("decrypted output ", o);
        return o;
    } catch (err) {
        Promise.reject("Secure Channel to Dauth Node is not setup correctly. Please refresh page and try again.")
    }
}
export function hashStr(cond: string) {
    var mdStr = md.sha256.create()
    mdStr.update(cond)
    return mdStr.digest().toHex()
}