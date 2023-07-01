import { p256 } from '@noble/curves/p256';
import * as utils from '@noble/curves/abstract/utils';

export const genKey = () => {
    // 33 uint8 array
    const localPriv = utils.bytesToHex(p256.utils.randomPrivateKey())
    // 32 uint8 array
    const localPubKey = utils.bytesToHex(p256.getPublicKey(localPriv, false))

    return {
        localPriv,
        localPubKey,
    }
}
