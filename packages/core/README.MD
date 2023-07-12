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

- `account`, which refers to the user's Google account, email address, or phone number;
- `id_type`, which can be `mailto`, `tel`;
- `request_id` is client-provided, and could be a string containing a unique transaction/bundle/userOp ID;

```javascript
    // account, account_type, request_id
      await dauth.service.sendOtp({
        account: account,
        id_type: 'mailto',
        request_id: request_id: 'The id related to the TX or userOp'
      })
```

2. The `authOtpConfirm` method can be used to verify an OTP code and obtain the DAuth proof.

```javascript
    // code,
    // request_id
    // mode: jwt | proof
    // id_type: "mailto" | "tel"
    const result = await dauth.service.authOtpConfirm({
        code,
        request_id: 'The id related to the TX or userOp',
        mode: 'jwt' // or 'proof',
        id_type: "mailto"
      })
    /* example return
    {
        "mode": "proof",
        "data": {
        "auth": {
        "account": "5146a933b8879b3******ee2f4b18573d0ccece0453de374589",
        "id_type": "mailto",
        "request_id": "test"
        },
        "signature": "717a84b617e9ae8c4d002e95073cfdc07e1c388***5b93658ea94f32945064dc0932ddeebb0d0fa17408b4e62aeea355304b6201b"
        }
    }
    or
    {
            "mode": "jwt",
                "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhbGciOiJSUz*****vPdVzvmySt9dRlJ7IKH2VFP_7tKsndgLQxqXeDrEavdA3sptb7H6KdG4P57B3YDkXCkYo32Ts5PGgwxh3ayfjGC46WToWASL_p3XkFsDBiX6CW8Ko3ohqERwB1s6yBO4B-ox4r6591jnzy1AIstnEFmt673yqJLQ"
        }
    */
}
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
  mode: "jwt", // or 'proof'
});
/* example return 
       {
        "mode": "proof",
        "data": {
            "auth": {
            "account": "f69fd6bd0e98a7c2792e1****a3e7fd5de767",
            "id_type": "google",
            "request_id": "test"
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

#### Apple OAuth

Ensure you've completed the [SDK application form](https://forms.gle/3A1bRx2ipX2fBLsw5).

1. Retrieve authorization code from Apple.

We recommend you to use [react-apple-login](https://www.npmjs.com/package/react-apple-login) to get the authorization code.

2. Upon receiving the authorization code, the `authOAuth` method can be used to procure the DAuth proof.

```javascript
// code,
// request_id,
// id_type
// mode: jwt | proof
const result = await dauth.service.authOauth({
  token: authorization_code,
  request_id: "test",
  id_type: "apple",
  mode: "jwt", // or 'proof'
});
/* example return 
       {
        "mode": "proof",
        "data": {
            "auth": {
            "account": "f69fd6bd0e98a7c2792e1****a3e7fd5de767",
            "id_type": "apple",
            "request_id": "test"
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

    Please refer to [Twitter Oauth2 wiki](https://developer.twitter.com/en/docs/authentication/guides/log-in-with-twitter#obtain-a-request-token) and [example]() to obtain the twitter auth code. 

2. Upon receiving the authorization code, the `authOAuth` method can be used to procure the DAuth proof.

```javascript
// code,
// request_id,
// id_type
// mode: jwt | proof
const result = await dauth.service.authOauth({
  token: authorization_code,
  request_id: "test",
  id_type: "apple",
  mode: "jwt", // or 'proof'
});
/* example return 
       {
        "mode": "proof",
        "data": {
            "auth": {
            "account": "f69fd6bd0e98a7c2792e1****a3e7fd5de767",
            "id_type": "apple",
            "request_id": "test"
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
