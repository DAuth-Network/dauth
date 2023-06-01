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
const DAuth = require('@dauth/core');
const dauth = new DAuth('dauth node-url');
```

### Leveraging OPT Authentication with DAuth

1. Use the `authOpt` method to deliver an OTP code to the user. This method requires three parameters:
* `account`, which refers to the user's Google account, email address, or phone number;
* `account_type`, which can be `email`, `google`, or `sms`;
* `request_id` is client-provided, and could be a string containing a unique transaction/bundle/userOp ID;

```javascript
    // account, account_type, request_id
    await dauth.service.authOpt({
        account: account,
        account_type: 'email',
        request_id: 'The id related to the TX or userOp'
      })
```

2. The `authOptConfirm` method can be used to verify an OTP code and obtain the DAuth proof.

```javascript
    // code, request_id
    const result = await dauth.service.authOptConfirm({
        code,
        request_id: 'test'
      })
    /* example return 
    {
    "auth": {
        "account": "8f20fae59e796d5b5249......aea2c7fc6200dc5fbd5a",
        "auth_type": "email",
        "request_id": "test"
    },
    "signature": "49fc6da1f3664fe66ef5a4311584d0b5a6.....cb44a3ba84729dd2c08ac05edd01dc41501d5d1a96631c"
    */
}
```

Successful One-Time Password (OTP) verification via DAuth Network results in the generation of a signature, functioning as DAuth proof. This allows anyone to validate the user's identity. The proof can also be verified on-chain. Consequently, contract wallets can bypass all centralized verifications, triggering user transactions in a decentralized manner directly.

### Utilizing OAuth with DAuth

#### Google OAuth

Ensure you've completed the [SDK application form](https://forms.gle/3A1bRx2ipX2fBLsw5).

1. Retrieve authorization code from Google.

We recommand you to use [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) to get the authorization code. 

2. Upon receiving the authorization code, the `authOAuth` method can be used to procure the DAuth proof.

```javascript
    // code, request_id, auth_type
    const result = await dauth.service.authOauth({
        token: authorization_code,
        request_id: 'test',
        auth_type: 'google'
      })
    /* example return 
        {
    "auth": {
        "account": "f69fd6bd0e98a7c2792e1909cedf21455f9629940c5d8fcaec8aa3e7fd5de767",
        "auth_type": "google",
        "request_id": "The id related to the TX or userOp"
    },
    "signature": "a5186118ad83eb466e60b37dcc97e159272335********052c3253aa60ac2c63fd1c"
    }
}
```


