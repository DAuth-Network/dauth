# 🚀 DAuth/core

By integrating the DAuth SDK into your platform, you can offer your users a decentralized and verifiable social authentication experience. This includes One-Time Password (OTP) methods via Email and SMS, and OAuth protocols through platforms like Google and Github.

## 🎉 Features

- Integration with DAuth Network
- Build encrypted channel for each data transfer, make sure all the user info is invisible to any DAuth Node
- Get and verify OTP codes through the private channel
- Get the idtoken through OAuth flow and generate ZK proof based on the token;
- Easy to use and implement

## 📦 Installation

The easiest way to install DAuth is through npm:

```shell
yarn add @dauth/core
```

## 🚀 Getting Started

Once the package installed, you can import it into your project and start using it:

```javascript
const DAuth = require('@dauth/core');
const dauth = new DAuth('dauth node-url');
```

To get an OTP code, you can use the `authOpt` method:

```javascript
    // email, account_type, request_id
    await dauth.service.authOpt({
        account: email,
        account_type: 'email',
        request_id: 'test'
      })
```
To verify an OTP code, you can use the `authOptConfirm` method:

```javascript
    // email, request_id
    const result = await dauth.service.authOptConfirm({
        code,
        request_id: 'test'
      })
    // return 
    {
    "auth": {
        "account": "8f20fae59e796d5b5249......aea2c7fc6200dc5fbd5a",
        "auth_type": "email",
        "request_id": "test"
    },
    "signature": "49fc6da1f3664fe66ef5a4311584d0b5a6.....cb44a3ba84729dd2c08ac05edd01dc41501d5d1a96631c"
}
```

If otp verify success, you will get a signature which was signed by dauth node server. You can use this signature as the DAuth proof to verify the identity of the user on-chain. 

### Using OAuth in DAuth

Coming soon.
