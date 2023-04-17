import forge from 'node-forge'
import exchangeKey from '../services/exchangeKey'

export async function encrypt(rawText: string, key: string) {
  console.log('encrypt content', rawText, ' with ', key)
  if (key === '') {
    alert(
      'Secure Channel to Keysafe Node is not setup correctly. Please refresh page and try again.'
    )
    return
  }
  try {
    console.log('prepare key')
    var aesKey = forge.util.hexToBytes(key)
    var cipher = forge.cipher.createCipher('AES-GCM', aesKey)
    const iv = new Uint8Array(12) as any
    console.log('prepare iv')
    cipher.start({
      iv: iv,
      tagLength: 128,
    })
    console.log(cipher)
    cipher.update(forge.util.createBuffer(rawText, 'raw'))
    console.log('finish.')
    cipher.finish()
    const a = cipher.output.toHex()
    var tag = cipher.mode.tag
    console.log('encrypted ', a)
    cipher.output.getBytes()
    return tag.toHex() + a
  } catch (err) {
    console.log('failing')
    console.log('error happening ', err)
    return ''
  }
}

export function hashStr(cond: string) {
  var md = forge.md.sha256.create()
  md.update(cond)
  return md.digest().toHex()
}

export async function hashAndEncrypt(rawText: string, key: string) {
  const hash = hashStr(rawText)
  const encrypted = await encrypt(rawText, key)
  return encrypted
}

export async function exchangeKeyAndEncrypt(rawText: string) {
  const { session_id, shareKey } = await exchangeKey.exchange()
  const cipher_code = await encrypt(rawText, shareKey)
  return { session_id, cipher_code }
}
