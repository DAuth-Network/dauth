# 🚀 DAuth/core

Integrate the DAuth SDK into your platform to provide your users with a decentralized, verifiable social authentication experience. DAuth includes One-Time Password (OTP) methods through Email and SMS, and OAuth protocols via platforms such as Google and Github.

## 🎉 Key Features

- Seamless integration with the DAuth Network.
- Establish an encrypted channel for every data transfer, ensuring user data remains hidden from DAuth Nodes.
- Securely receive and verify OTP codes through a private channel.
- Procure idtoken via OAuth flow and generate ZK proof based on the token.
- Designed for ease of use and implementation.

## 📦 Installation

The simplest method to install DAuth is via npm:

```shell
yarn add @dauth/core
```

## 🚀 Getting Started

Before you begin, please complete the [SDK application form](https://forms.gle/3A1bRx2ipX2fBLsw5) to obtain your client ID from DAuth.

After installing the package, import it into your project and begin to utilize it:

```javascript
import DAuth from "@dauth/core";
const dauth = new DAuth({
  baseURL: "dauth node-url",
  clientID: "demo",
});
```

### Leveraging OPT Authentication with DAuth

1. Use the `sendOtp` method to deliver an OTP code to the user. This method requires three parameters:

- `account`, which refers to the user's Google account, email address, or phone number. It is hexlike string without "0x".
- `id_type`, which can be `mailto`, `tel`;
- `request_id` is client-provided, and could be a string containing a unique transaction/bundle/userOp ID. It is string or hexlike string without "0x".

```typescript
// account, account_type, request_id
await dauth.service.sendOtp({
  account: account,
  id_type: "mailto",
  request_id: "request_id", // request_id: 'The id related to the TX or userOp'
});
```

2. The `authOtpConfirm` method can be used to verify an OTP code and obtain the DAuth proof.


```typescript
 enum ESignMode {
   JWT = "jwt",
   PROOF = "proof",
   JWT_FIREBASE = "jwtdb",
   BOTH = "both"
}

// code,
// request_id
// mode: ESignMode
// id_type: "mailto" | "tel"
const result = await dauth.service.authOtpConfirm({
   code: emailOtp,
   request_id: requestId,
   mode: ESignMode.JWT,
   id_type: 'mailto',
   withPlainAccount: true // boolean, If true will return real email account
})
/* example return
{
  "mode": "proof",
  "data": {
    "auth": {
      "acc_and_type_hash": "c5056aae3e4b528500f5e19b0e**********c916766cdb226",
      "request_id": "test",
      "account_plain": "scoxxxxxxx@gmail.com"
    },
    "signature": "578be12beb6cb5702c0c14e5b48b1599387225c96dba2cb8ce55001508******613532c5bfc2766ecd778f86d3057c81ed47a1c"
  }
}
or
{
       "mode": "jwt",
        "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhbGciOiJSUz*****vPdVzvmySt9dRlJ7IKH2VFP_7tKsndgLQxqXeDrEavdA3sptb7H6KdG4P57B3YDkXCkYo32Ts5PGgwxh3ayfjGC46WToWASL_p3XkFsDBiX6CW8Ko3ohqERwB1s6yBO4B-ox4r6591jnzy1AIstnEFmt673yqJLQ"
}
or 
{
  "mode": "both",
  "data": {
    "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhbGciOiJSU*****6ImRhdXRoLm5ldHdvcmsiLCJhdWQiOiJkZW1vIiwiaWF0IjoxNjkwMjc1ODU0LCJleHAiOjE2OTAyNzk0NTR9.dSJXkq2dh816Sg31drUjwR0Wt1ih1SNtx_XFAzyVMKdzAQNKwlXIsFrh3mhicyHy0f6S2M7d1rUvj1OSloOTMInMe9WTc0ODBowo9B2UffqXZILZpRfA1rLlhpP1bzIK-MkarIK2npcbxpvpUkxzPivNrq_XZbidxoascxJs_4M94I8uMlL4XcjtGIi28Bgr3eqoAOE_lO9lby-L_X9XMMo6urlu5g0kR8UlGM3BeQA5hXIpBCJjLN35C29n9S9tc0vsuKfk2etWlWGG6brnUfmYI-ntKkPD8rSXJzNuWd3yCHadKcS93Rofz952PcCoWAYEiG3mkOw5K5v_dV9VNb6gq_29mWfIBgkkpBQosRSrjZ9hXj2r6IeMjJn6ffGMG8xbmtN1q_lUFKb1ZAVYR2gtvG2WYwKZC1m3Qa4rcQwK6KT3-rcqWbg-GhWEay-I5wW4Lr9ULD69cQccsnuiCwt50x4KZyAXYLgTF92OFuwgteZCO3n1uzL6y5hsX0Th",
    "proof": {
      "auth": {
        "account": "d47f8269df8dee4059d8152d6b1fe5810d6af9228ee57a3811596f780ad8d041",
        "id_type": "mailto",
        "request_id": "test",
        "account_plain": "scoxxxxxxx@gmail.com"
      },
      "signature": "578be12beb6cb5702c0c14e5b4******c226e0cfbb454613532c5bfc2766ecd778f86d3057c81ed47a1c"
    }
  }
}
    
*/
```

Successful One-Time Password (OTP) verification via DAuth Network results in the generation of a signature, functioning as DAuth proof. This allows anyone to validate the user's identity. The proof can also be verified on-chain. Consequently, contract wallets can bypass all centralized verifications, triggering user transactions in a decentralized manner directly.

### Utilizing OAuth with DAuth

#### Google OAuth

Ensure you've completed the [SDK application form](https://forms.gle/3A1bRx2ipX2fBLsw5).

1. Retrieve authorization code from Google.

We recommend you to use [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) to get the authorization code.

2. Upon receiving the authorization code, the `authOAuth` method can be used to procure the DAuth proof.

```javascript
// code,
// request_id,
// id_type
// mode: jwt | proof
const result = await dauth.service.authOauth({
  token: authorization_code,
  request_id: "test",
  id_type: "google",
  mode: ESignMode.JWT
});
/* example return 
       {
        "mode": "proof",
        "data": {
            "auth": {
              "acc_and_type_hash": "c5056aae3e4b528500f5e19b0e**********c916766cdb226",
              "request_id": "test",
              "account_plain": "scoxxxxxxx@gmail.com"
            },
            "signature": "a5186118ad83eb466e60b37******47efd65dd387e1226052c3253aa60ac2c63fd1c"
        }
    }
    or 
    {
            "mode": "jwt",
                "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhbGciOiJSUz*****vPdVzvmySt9dRlJ7IKH2VFP_7tKsndgLQxqXeDrEavdA3sptb7H6KdG4********jGC46WToWASL_p3XkFsDBiX6CW8Ko3ohqERwB1s6yBO4B-ox4r6591jnzy1AIstnEFmt673yqJLQ"
        }
         */
```

#### Apple OAuth

Ensure you've completed the [SDK application form](https://forms.gle/3A1bRx2ipX2fBLsw5).

1. Retrieve authorization code from Apple.

We recommend you to use [react-apple-login](https://www.npmjs.com/package/react-apple-login) to get the authorization code.

2. Upon receiving the authorization code, the `authOAuth` method can be used to procure the DAuth proof.

```
// code,
// request_id,
// id_type
// mode: ESignMode
const result = await dauth.service.authOauth({
  token: authorization_code,
  request_id: "test",
  id_type: "apple",
  mode: ESignMode.JWT
});
/* example return
       {
        "mode": "proof",
        "data": {
            "auth": {
              "acc_and_type_hash": "c5056aae3e4b528500f5e19b0e**********c916766cdb226",
              "request_id": "test",
              "account_plain": "scoxxxxxxx@gmail.com"
          },
        "signature": "a5186118ad83eb466e60b37******47efd65dd387e1226052c3253aa60ac2c63fd1c"
        }
    }
    or
    {
            "mode": "jwt",
             "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhbGciOiJSUz*****vPdVzvmySt9dRlJ7IKH2VFP_7tKsndgLQxqXeDrEavdA3sptb7H6KdG4P57B3YDkXCkYo32Ts5PGgwxh3ayfjGC46WToWASL_p3XkFsDBiX6CW8Ko3ohqERwB1s6yBO4B-ox4r6591jnzy1AIstnEFmt673yqJLQ"
        }
         */
```

#### Twitter OAuth

Ensure you've completed the [SDK application form](https://forms.gle/3A1bRx2ipX2fBLsw5).

1. Retrieve authorization code from Twitter Oauth2.

   Please refer to [Twitter Oauth2 wiki](https://developer.twitter.com/en/docs/authentication/guides/log-in-with-twitter#obtain-a-request-token) and [Our simple example](https://github.com/DAuth-Network/dauth/blob/main/apps/demo/src/components/TwitterLogin.tsx) to obtain the twitter auth code.

2. Upon receiving the authorization code, the `authOAuth` method can be used to procure the DAuth proof.

```javascript
// code,
// request_id,
// id_type
// mode: ESignMode
const result = await dauth.service.authOauth({
  token: authorization_code,
  request_id: "test",
  id_type: "twitter",
  mode: ESignMode.JWT
});
/* example return 
       {
        "mode": "proof",
        "data": {
            "auth": {
              "acc_and_type_hash": "c5056aae3e4b528500f5e19b0e**********c916766cdb226",
              "request_id": "test",
              "account_plain": "scoxxxxxxx@gmail.com"
            },
            "signature": "a5186118ad83eb466e60b37******47efd65dd387e1226052c3253aa60ac2c63fd1c"
        }
    }
    or 
    {
            "mode": "jwt",
                "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhbGciOiJSUz*****vPdVzvmySt9dRlJ7IKH2VFP_7tKsndgLQxqXeDrEavdA3sptb7H6KdG4P57B3YDkXCkYo32Ts5PGgwxh3ayfjGC46WToWASL_p3XkFsDBiX6CW8Ko3ohqERwB1s6yBO4B-ox4r6591jnzy1AIstnEFmt673yqJLQ"
        }
         */
```

### How to verify?

#### 1. Proof Verification

Dauth/core provide a "verifyProof" method to verify proof. The term "proof" in this context refers to a piece of evidence or verification that includes both the signed data and the metadata associated with the signature.

```typescript
import { verifyProof } from "@dauth/core";
const result = await authOtpConfirm({
  code,
  request_id: "The id related to the TX or userOp",
  mode: "proof",
  id_type: "mailto",
});

const isValid = verifyProof(result.data);
```

The following is the source code for verifyProof, you can implement it in your preferred language.

```typescript
import { utils } from "ethers";
export const verifyProof = (
  proof: IOtpConfirmReturn,
  dauthSignerAddress = "0xf3b4e49Fd77A959B704f6a045eeA92bd55b3b571"
) => {
   const {auth, signature} = proof
    // String to hexlike
    const sig = "0x" + signature
    const {acc_and_type_hash, request_id} = auth
    // request_id can be two types: string or hex
    // The request_id can have two types of values: a simple string or a hexadecimal string.
    // If the length of the request_id is 64 characters, it is treated as a hexadecimal string.
    // Otherwise, if the length is different from 64, it is treated as a regular string.
    const request_id_hash = request_id.length === 64
        ? utils.arrayify("0x" + request_id) : utils.keccak256(utils.toUtf8Bytes(request_id))
    // Concat data
    const msg = utils.defaultAbiCoder.encode(
        ["bytes32", "bytes32"],
        ["0x"+ acc_and_type_hash, request_id_hash])
    // Hash and turn to bytes
    const msgHash = utils.arrayify(utils.keccak256(msg))
    // Computes the EIP-191 personal message digest of message.
    // Personal messages are converted to UTF-8 bytes and prefixed with \x19Ethereum Signed Message: and the length of message.
    const msgHashWithPrefix = utils.hashMessage(msgHash)

    const recoveredAddress = utils.recoverAddress(msgHashWithPrefix, sig);

    return recoveredAddress.toLowerCase() === dauthSignerAddress.toLocaleLowerCase()
};
```

