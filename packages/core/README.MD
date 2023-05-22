# 🚀 DAuth/core

DAuth is a Github project that provides integration with the dauth node server. With DAuth, you can easily get and verify OTP (One-Time Password) codes using @dauth/core through a private channel.

## 🎉 Features

- Integration with dauth node server
- Get and verify OTP codes through a private channel
- Easy to use and implement

## 📦 Installation

The easiest way to install DAuth is through npm:

```shell
yarn add @dauth/core
```

## 🚀 Getting Started

Using DAuth is simple. First, you should install it as shown above. Once installed, you can import it into your project and start using it:

```javascript
const DAuth = require('@dauth/core');
const dauth = new DAuth('node-url');
```

To get an OTP code, you can use the `getOTP` method:

```javascript
    // email, account_type, request_id
    await dauth.service.authOpt(email, 'email', 'test')
```
To verify an OTP code, you can use the `verifyOTP` method:

```javascript
    // email, request_id
    const result = await dauth.service.authOptConfirm(code, 'test')
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

If otp verify success, you will get a signature which was signed by dauth node server. You can use this signature to verify the identity of the user. 
