import { dauth_exchangeKey } from './http'
import * as elliptic from 'elliptic'

const EC = elliptic.ec

class ExchangeKey {
  session_id = ''
  shareKey = ''
  genKey = async () => {
    const ec = new EC('p256')
    const localKeyPair = ec.genKeyPair()
    const localPubKey = (localKeyPair.getPublic() as any).encode('hex')
    return {
      localPubKey,
      localKeyPair,
    }
  }
  public exchange = async () => {
    if (this.session_id && this.shareKey) {
        return { session_id: this.session_id, shareKey: this.shareKey }
    }
    const { localPubKey, localKeyPair } = await this.genKey()
    const res = await dauth_exchangeKey({ key: localPubKey })

    const { session_id, key } = res
    const ec = new EC('p256')
    const remoteKeyObj = ec.keyFromPublic(key, 'hex')
    const bn = localKeyPair.derive(remoteKeyObj.getPublic())
    const origShareKey = bn.toString(16)
    const shareKey = origShareKey.slice(origShareKey.length / 2)
    this.session_id = session_id
    this.shareKey = shareKey
    return { session_id, shareKey }
  }
}

export default new ExchangeKey()
