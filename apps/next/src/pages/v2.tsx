"use client";
import { FC, useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppleLogin from "react-apple-login";
import GoogleLoginCom from "../components/GoogleLogin";
import { dauthV2 as dauth } from "../utils";
import TwitterLogin from "../components/TwitterLogin";
import { ESignMode, IOtpConfirmReturnV2, TSign_mode, verifyProof, verifyProofV2 } from "@dauth/core";
import { useLocalStorageState, useRequest } from "ahooks/lib";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '@/components/ui/input';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router'

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });
const SDK: FC = () => {
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [smsOtp, setSmsOtp] = useState('')
    const [emailOtp, setEmailOtp] = useState('')
    const [userKey, setUserKey] = useState('')
    const [signMsg, setSignMsg] = useState('')
    const [salt, setSalt] = useState(0)
    const [userKeySig, setUserKeySig] = useState('')
    const [requestId, setRequestId] = useState('test')
    const [withPlainAccount, setWithPlainAccount] = useState(false)
    const [mode, setMode] = useLocalStorageState<ESignMode>(
        'use-local-storage-state-demo1',
        {
            defaultValue: ESignMode.JWT,
        },
    );
    const [result, setRes] = useState<{
        data: IOtpConfirmReturnV2,
        mode: TSign_mode
    }>()
    const router = useRouter()
    const code = router.query.twitterAuth as string
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
                request_id: requestId,
            })
        } catch (error) {
            console.log(error)
        }
    }
    const authOtpConfirmAndGenerateKey = async () => {
        try {
            const res = await dauth.service.authOtpConfirmAndGenerateKey({
                code: emailOtp,
                request_id: requestId,
                mode: mode,
                id_type: 'mailto',
                withPlainAccount,
                id_key_salt: salt,
                sign_msg: signMsg,
                user_key: userKey,
                user_key_signature: userKeySig
            })
            console.log(res)
            setRes(res)
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
                id_type: 'mailto',
                id_key_salt: salt,
                sign_msg: signMsg,
                withPlainAccount,
                user_key: userKey,
                user_key_signature: userKeySig
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }
    const authOtpConfirmAndRecoverKey = async () => {
        try {
            const res = await dauth.service.authOtpConfirmAndRecoverKey({
                code: emailOtp,
                request_id: requestId,
                mode: mode,
                id_type: 'mailto',
                id_key_salt: salt,
                sign_msg: signMsg,
                withPlainAccount,
                user_key: userKey,
                user_key_signature: userKeySig
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
                id_type: 'tel',
                id_key_salt: salt,
                sign_msg: signMsg,
                withPlainAccount,
                user_key: userKey,
                user_key_signature: userKeySig
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
                id_key_salt: salt,
                sign_msg: signMsg,
                mode,
                user_key: userKey,
                user_key_signature: userKeySig
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
                id_key_salt: salt,
                sign_msg: signMsg,
                mode,
                user_key: userKey,
                user_key_signature: userKeySig
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
                mode,
                id_key_salt: salt,
                sign_msg: signMsg,
                user_key: userKey,
                user_key_signature: userKeySig
            })
            console.log(res)
            setRes(res)
        } catch (error) {
            console.log(error)
        }
    }
    const verify = async () => {
        const proof = result!.data
        const isValid = await verifyProofV2(proof, signMsg)
        console.log("isValid", isValid)
        if (isValid) {
            console.log("valid")
        }
    }
    const onClick = (e: any) => {
        console.log(e)
        setWithPlainAccount(e)
    }
    const selectMod = (e: any) => {
        console.log(e)
        setMode(e)
    }
    return (
        <div className="App">
            <div className="flex items-center">
                <h2 className="text-xl">@DAuth/core V2 example</h2>
                <Button variant='link' onClick={() => { router.push('/') }}>Go to v1</Button>
            </div>
            <div className="flex w-full">
                <div>
                    <div className="bg-gray-100 p-4 my-4">
                        <div className={"my-6 text-lg"}>
                            Global setting
                        </div>

                        <div className={"flex justify-between mb-2"}>
                            Sign mode:
                            <Select onValueChange={selectMod} value={mode} defaultValue={ESignMode.PROOF}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ESignMode.PROOF}>PROOF</SelectItem>
                                    <SelectItem value={ESignMode.JWT}>JWT</SelectItem>
                                    <SelectItem value={ESignMode.JWT_FIREBASE}>JWT_FIREBASE</SelectItem>
                                    <SelectItem value={ESignMode.BOTH}>BOTH</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className={"flex justify-between"}>
                            Request Id: <Input className=" py-2 border-2 w-56 rounded-sm" value={requestId}
                                onChange={(e) => {
                                    setRequestId(e.target.value)
                                }} type="text" />

                        </div>
                        <div className={"flex justify-between"}>
                            user key: <Input className=" py-2 border-2 w-56 rounded-sm" value={userKey}
                                onChange={(e) => {
                                    setUserKey(e.target.value)
                                }} type="text" />
                        </div>
                        <div className={"flex justify-between"}>
                            user key signature: <Input className=" py-2 border-2 w-56 rounded-sm" value={userKeySig}
                                onChange={(e) => {
                                    setUserKeySig(e.target.value)
                                }} type="text" />
                        </div>
                        <div className="flex justify-between">
                            <span className="w-32 inline-block">id_key_salt</span>
                            <Input className=" py-2 border-2 w-56" value={salt} onChange={(e) => {
                                setSalt(Number(e.target.value))
                            }} type="text" />

                        </div>
                        <div className="flex justify-between">
                            <span className="w-32 inline-block">sign_msg</span>
                            <Input className=" py-2 border-2 w-56" value={signMsg} onChange={(e) => {
                                setSignMsg(e.target.value)
                            }} type="text" />

                        </div>
                        <div className={"justify-between flex mt-2"}>
                            withPlainAccount: <Switch onCheckedChange={onClick} checked={withPlainAccount} />
                        </div>


                    </div>
                    <div className=" bg-gray-100 p-4">
                        <div className="text-xl">
                            Email otp example
                        </div>
                        <div className="flex justify-start items-center"><span
                            className="w-32 inline-block">email:</span>
                            <Input className=" py-2 border-2 w-56 rounded-sm	" value={email} onChange={(e) => {
                                setEmail(e.target.value)
                            }} type="text" />
                            <Button onClick={authEmailOtp} className="w-40 ml-10">
                                get otp
                            </Button>
                        </div>
                        <br />
                        <div className="flex justify-start items-center">
                            <span className="w-32 inline-block">otp: </span>
                            <Input className=" py-2 border-2 w-56	" value={emailOtp} onChange={(e) => {
                                setEmailOtp(e.target.value)
                            }} type="text" />

                        </div>

                        <br />
                        <div className="flex justify-start">
                            <Button onClick={authEmailOtpConfirm} className="w-30 ml-10">
                                confirm otp
                            </Button>
                            <Button onClick={authOtpConfirmAndGenerateKey} className="w-30 ml-10">
                                confirm otp generateKey
                            </Button>
                            <Button onClick={authOtpConfirmAndRecoverKey} className="w-30 ml-10">
                                confirm otp RecoverKey
                            </Button>
                        </div>

                    </div>
                    <div className=" bg-gray-100 p-4 mt-10">
                        <div className="text-xl">
                            SMS otp example
                        </div>
                        <div className="flex justify-between items-center"><span
                            className="w-32 inline-block">Phone:</span>
                            <Input className=" py-2 border-2 w-56 rounded-sm" value={phone} onChange={(e) => {
                                setPhone(e.target.value)
                            }} type="text" />
                            <Button onClick={authSMSOtp} className="w-40 ml-10">
                                get otp
                            </Button>
                        </div>
                        <br />
                        <div className="flex justify-between items-center">
                            <span className="w-32 inline-block">otp: </span>
                            <Input className=" py-2 border-2 w-56" value={smsOtp} onChange={(e) => {
                                setSmsOtp(e.target.value)
                            }} type="text" />

                            <Button onClick={authSMSOtpConfirm} className="w-40 ml-10">
                                confirm otp
                            </Button>
                        </div>


                    </div>
                    <div className=" bg-gray-100 p-4  mt-10">
                        <div className="text-xl py-4">
                            Google oauth example
                        </div>
                        <GoogleOAuthProvider
                            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLINT_ID as string}>
                            <GoogleLoginCom onLoginSuccess={authGoogleOAuth}></GoogleLoginCom>
                        </GoogleOAuthProvider>
                    </div>
                    <div className=" bg-gray-100 p-4 mt-10">
                        <div className="text-xl py-4">
                            Apple signin example
                        </div>
                        <AppleLogin
                            callback={authAppleOAuth}
                            clientId={process.env.NEXT_PUBLIC_APPLE_CLINT_ID as string}
                            scope="email"
                            responseMode="query"
                            responseType="code"
                            redirectURI={origin} />
                    </div>
                    <div className=" bg-gray-100 p-4  mt-10">
                        <div className="text-xl py-4">
                            Twitter signin example
                        </div>
                        <TwitterLogin />
                    </div>
                </div>
                <div className="p-10 w-3/5">
                    {result && <>
                        <DynamicReactJson displayDataTypes={false} quotesOnKeys={false} name={null}
                            collapseStringsAfterLength={128} indentWidth={2} src={result!} />
                        {
                            mode === ESignMode.PROOF && <div>
                                <Button onClick={verify}>verify</Button>
                            </div>
                        }
                    </>}

                </div>

            </div>
        </div>
    );

}

export default SDK;

