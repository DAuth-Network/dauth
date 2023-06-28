import { genKey } from "../utils/curve"

describe('genKey', () => { 
    it('should return localPriv and localPubKey', async () => {
        const res1 = genKey()
        console.log(res1)
    })
 })
 