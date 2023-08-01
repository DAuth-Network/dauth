import {IOtpConfirmReturn} from "../types"
import {utils} from "ethers"

export const isEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}
export const sleep = (ms = 1000) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
export const verifyProof = (proof: IOtpConfirmReturn, dauthSignerAddress = '0xf3b4e49Fd77A959B704f6a045eeA92bd55b3b571') => {

    const {auth, signature} = proof
    // String to hexlike
    const sig = "0x" + signature
    const {acc_and_type_hash, request_id} = auth
    // String to bytes and hash
    // const acc_and_type_hash = utils.toUtf8Bytes(acc_and_type_hash)
    // request_id can be two types: string or hex
    // The request_id can have two types of values: a simple string or a hexadecimal string.
    // If the length of the request_id is 64 characters, it is treated as a hexadecimal string.
    // Otherwise, if the length is different from 64, it is treated as a regular string.
    const request_id_hash = request_id.length === 64
        ? utils.arrayify("0x" + request_id) : utils.keccak256(utils.toUtf8Bytes(request_id))
    // Concat data
    const msg = utils.defaultAbiCoder.encode(
        ["bytes32", "bytes32"],
        [acc_and_type_hash, request_id_hash])
    // Hash and turn to bytes
    const msgHash = utils.arrayify(utils.keccak256(msg))
    // Computes the EIP-191 personal message digest of message.
    // Personal messages are converted to UTF-8 bytes and prefixed with \x19Ethereum Signed Message: and the length of message.
    const msgHashWithPrefix = utils.hashMessage(msgHash)

    const recoveredAddress = utils.recoverAddress(msgHashWithPrefix, sig);

    return recoveredAddress.toLowerCase() === dauthSignerAddress.toLocaleLowerCase()


}