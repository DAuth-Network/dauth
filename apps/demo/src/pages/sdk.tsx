import ReactJson from 'react-json-view'
import { FC, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import GoogleLoginCom from "../components/GoogleLogin";
import { dauth } from "../utils";
import TwitterLogin from "../components/TwitterLogin";
import { IOtpConfirmReturn, TSign_mode } from "@dauth/core";
import { useSearchParams } from "react-router-dom";
import { useRequest } from "ahooks";

import ethers, { utils } from "ethers"
const SDK: FC = () => {

    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [smsOtp, setSmsOtp] = useState('')
    const [emailOtp, setEmailOtp] = useState('')
    const [requestId, setRequestId] = useState('test')

    const [mode, setMode] = useState<TSign_mode>('jwt')
    const [res, setRes] = useState<IOtpConfirmReturn>()
    const [searchParams] = useSearchParams();
    const code = searchParams.get("twitterAuth")
    const authEmailOtp = async () => {
        try {
            await dauth.service.sendOtp({
                account: email,
                id_type: "mailto",
                request_id: requestId
            })
        } catch (error) {
            console.log(error)
        }
    }
    const authSMSOtp = async () => {
        try {
            await dauth.service.sendOtp({
                account: phone,
                id_type: 'tel',
                request_id: requestId
            })
        } catch (error) {
            console.log(error)
        }
    }
    const authEmailOtpConfirm = async () => {
        try {
            const res = await dauth.service.authOtpConfirm({
                code: emailOtp,
                request_id: requestId,
                mode: mode,
                id_type: 'mailto'
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }
    const authSMSOtpConfirm = async () => {
        try {
            const res = await dauth.service.authOtpConfirm({
                code: smsOtp,
                request_id: requestId,
                mode,
                id_type: 'tel'
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }

    const authGoogleOAuth = async (token: string) => {
        try {
            const res = await dauth.service.authOauth({
                token,
                request_id: requestId,
                id_type: 'google',
                mode
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }
    const authTwitterOAuth = async () => {
        try {
            const res = await dauth.service.authOauth({
                token: code!,
                request_id: requestId,
                id_type: 'twitter',
                mode
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }
    useRequest(authTwitterOAuth, {
        ready: !!code,
        debounceWait: 1000,

    })


    const authAppleOAuth = async (response: any) => {
        const code = response.code
        try {
            const res = await dauth.service.authOauth({
                token: code,
                request_id: requestId,
                id_type: 'apple',
                mode
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }
    const verify = () => {
        const { auth, signature } = res!.data
        const { account, id_type, request_id } = auth
        const id_type_hash = utils.keccak256(utils.toUtf8Bytes(id_type))
        const request_id_hash = utils.keccak256(utils.toUtf8Bytes(request_id))

        const msgHash = utils.keccak256(
            utils.defaultAbiCoder.encode(["bytes32", "bytes32", "bytes32"],
                [id_type_hash,
                    "0x" + account,
                    request_id_hash]))

        const recoveredPubKey = utils.recoverPublicKey(msgHash, "0x" + signature);
        const recoveredAddress = utils.recoverAddress(msgHash, "0x" + signature);

        console.log("recoveredPubKey", recoveredPubKey)
        console.log("recoveredAddress", recoveredAddress)
        // console.log("hash email", utils.keccak256(utils.toUtf8Bytes("ironchaindao@gmail.com")))
    }

    return (
        <div className="App">
            <h2 className="text-xl pb-4">@DAuth/core example</h2>
            <div className="flex w-full">
                <div>
                    <div className=" bg-red-50 p-4 my-4">
                        <div>
                            Global setting
                        </div>

                        <div>
                            Sign mode: (jwt | proof) <input className=" py-2 border-2 w-56 rounded-sm	" value={mode} onChange={(e) => { setMode(e.target.value as TSign_mode) }} type='text' />
                        </div>
                        <div>
                            Request Id: <input className=" py-2 border-2 w-56 rounded-sm	" value={requestId} onChange={(e) => { setRequestId(e.target.value) }} type="text" />

                        </div>

                    </div>
                    <div className=" bg-red-50 p-4">
                        <div className="text-xl">
                            Email otp example
                        </div>
                        <div className="flex justify-between items-center"> <span className="w-16 inline-block">email:</span>
                            <input className=" py-2 border-2 w-56 rounded-sm	" value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" />
                            <button onClick={authEmailOtp} className="w-40 ml-10">
                                get otp
                            </button></div>
                        <br />
                        <div className="flex justify-between items-center">
                            <span className="w-16 inline-block">otp: </span>
                            <input className=" py-2 border-2 w-56	" value={emailOtp} onChange={(e) => { setEmailOtp(e.target.value) }} type="text" />

                            <button onClick={authEmailOtpConfirm} className="w-40 ml-10">
                                confirm otp
                            </button>
                        </div>

                    </div>
                    <div className=" bg-red-50 p-4 mt-10">
                        <div className="text-xl">
                            SMS otp example
                        </div>
                        <div className="flex justify-between items-center"> <span className="w-16 inline-block">Phone:</span>
                            <input className=" py-2 border-2 w-56 rounded-sm	" value={phone} onChange={(e) => { setPhone(e.target.value) }} type="text" />
                            <button onClick={authSMSOtp} className="w-40 ml-10">
                                get otp
                            </button></div>
                        <br />
                        <div className="flex justify-between items-center">
                            <span className="w-16 inline-block">otp: </span>
                            <input className=" py-2 border-2 w-56	" value={smsOtp} onChange={(e) => { setSmsOtp(e.target.value) }} type="text" />

                            <button onClick={authSMSOtpConfirm} className="w-40 ml-10">
                                confirm otp
                            </button>
                        </div>

                    </div>
                    <div className=" bg-red-50 p-4  mt-10">
                        <div className="text-xl py-4">
                            Google oauth example
                        </div>
                        <GoogleOAuthProvider clientId="821654150370-q5hjra4s693p61l3giv7halqf42h37o1.apps.googleusercontent.com">
                            <GoogleLoginCom onLoginSuccess={authGoogleOAuth}></GoogleLoginCom>
                        </GoogleOAuthProvider>
                    </div>
                    <div className=" bg-red-50 p-4  mt-10">
                        <div className="text-xl py-4">
                            Apple signin  example
                        </div>
                        <AppleLogin
                            callback={authAppleOAuth}
                            clientId="com.duath.network.oauth"
                            scope="email"
                            responseMode="query"
                            responseType="code"

                            redirectURI="https://demo-api.dauth.network/" />
                    </div>
                    <div className=" bg-red-50 p-4  mt-10">
                        <div className="text-xl py-4">
                            Twitter signin  example
                        </div>
                        <TwitterLogin />
                    </div>
                </div>
                <div className="p-10 w-3/5">
                    {res && <ReactJson displayDataTypes={false} quotesOnKeys={false} name={null} collapseStringsAfterLength={128} indentWidth={2} src={res!} />}
                </div>
                <div>
                    <button onClick={verify}>verify</button>
                </div>
            </div>
        </div>
    );

}

export default SDK;

