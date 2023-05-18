import forge from 'node-forge';
import exchangeKey from '../services/exchangeKey';
export async function encrypt(rawText, key) {
    console.log("encrypt content", rawText, " with ", key);
    if (key === "") {
        alert("Secure Channel to Dauth Node is not setup correctly. Please refresh page and try again.");
        return;
    }
    try {
        console.log("prepare key");
        var aesKey = forge.util.hexToBytes(key);
        var cipher = forge.cipher.createCipher('AES-GCM', aesKey);
        const iv = new Uint8Array(12);
        console.log("prepare iv");
        cipher.start({
            iv: iv,
            tagLength: 128
        });
        console.log(cipher);
        cipher.update(forge.util.createBuffer(rawText, 'raw'));
        console.log("finish.");
        cipher.finish();
        const a = cipher.output.toHex();
        var tag = cipher.mode.tag;
        console.log("encrypted ", a);
        cipher.output.getBytes();
        return tag.toHex() + a;
    }
    catch (err) {
        console.log("failing");
        console.log("error happening ", err);
        return "";
    }
}
export function decrypt(secretText, key) {
    //TODO: check if secretText is hex or binary
    console.log("decrypt content ", secretText, " with ", key);
    if (key === "") {
        alert("Secure Channel to Dauth Node is not setup correctly. Please refresh page and try again.");
        return;
    }
    try {
        var aesKey = forge.util.hexToBytes(key);
        // the first 16 bytes are for tag
        var tag = forge.util.hexToBytes(secretText.slice(0, 32));
        // the remaining bytes are cipher_text 
        var rawText = forge.util.hexToBytes(secretText.slice(32));
        var decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
        var iv = new Uint8Array(12);
        decipher.start({
            iv: iv,
            tagLength: 128,
            tag: tag
        });
        decipher.update(forge.util.createBuffer(rawText, 'raw'));
        decipher.finish();
        const a = decipher.output.toHex();
        console.log("decrypted hex ", a);
        const o = decipher.output.data;
        console.log("decrypted output ", o);
        return o;
    }
    catch (err) {
        console.log(err);
        return "";
    }
}
export function hashStr(cond) {
    var md = forge.md.sha256.create();
    md.update(cond);
    return md.digest().toHex();
}
export async function hashAndEncrypt(rawText, key) {
    const hash = hashStr(rawText);
    const encrypted = await encrypt(rawText, key);
    return encrypted;
}
export async function exchangeKeyAndEncrypt(rawText) {
    const { session_id, shareKey } = await exchangeKey.exchange();
    const cipher_code = await encrypt(rawText, shareKey);
    return { session_id, cipher_code };
}
