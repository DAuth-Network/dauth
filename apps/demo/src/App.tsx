import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { Button } from "@dauth/dauth-provider";
import ReactJson from 'react-json-view'
import DAuth from "@dauth/core";
import { useState } from "react";
import { IOtpConfirmReturn } from "@dauth/core/dist/types";
import { GoogleLoginCom } from "./components/GoogleLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
const dauth = new DAuth('https://demo-api.dauth.network/dauth/sdk/v1.1/')
function App() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [smsOtp, setSmsOtp] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [emailAuthRes, setEmailAuthRes] = useState<IOtpConfirmReturn>()
  const [smsAuthRes, setSmsAuthRes] = useState<IOtpConfirmReturn>()
  const [oAuthRes, setOAuthRes] = useState<IOtpConfirmReturn>()
  const authEmailOtp = async () => {
    try {
      await dauth.service.authOpt({
        account: email,
        account_type: 'email',
        request_id: 'test'
      })
    } catch (error) {
      console.log(error)
    }
  }
  const authSMSOtp = async () => {
    try {
      await dauth.service.authOpt({
        account: phone,
        account_type: 'sms',
        request_id: 'test'
      })
    } catch (error) {
      console.log(error)
    }
  }
  const authOtpConfirm = async () => {
    try {
      const res = await dauth.service.authOptConfirm({
        code: emailOtp,
        request_id: 'test'
      })
      console.log(res)
      setEmailAuthRes(res)
    } catch (error) {
      console.log(error)
    }
  }
  const authSMSOtpConfirm = async () => {
    try {
      const res = await dauth.service.authOptConfirm({
        code: smsOtp,
        request_id: 'test'
      })
      console.log(res)
      setSmsAuthRes(res)
    } catch (error) {
      console.log(error)
    }
  }
  const authGoogleOAuth = async (token: string) => {
    try {
      const res = await dauth.service.authOauth({
        token,
        request_id: 'test',
        auth_type: 'google'
      })
      console.log(res)
      setOAuthRes(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App p-10">
      <h2 className="text-xl pb-4">@DAuth/core example</h2>
      <div className=" bg-red-50 p-4 w-1/2">
        <div className="text-xl">
          Email otp example
        </div>
        <div className="flex justify-between items-center"> <span className="w-16 inline-block">email:</span>
          <input className=" py-2 border-2 w-56 rounded-sm	" value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" />
          <Button onClick={authEmailOtp} className="w-40 ml-10">
            get otp
          </Button></div>
        <br />
        <div className="flex justify-between items-center">
          <span className="w-16 inline-block">otp: </span>
          <input className=" py-2 border-2 w-56	" value={emailOtp} onChange={(e) => { setEmailOtp(e.target.value) }} type="text" />

          <Button onClick={authOtpConfirm} className="w-40 ml-10">
            confirm otp
          </Button>
        </div>
        <div>
          <div>
            {emailAuthRes && <ReactJson displayDataTypes={false} collapsed src={emailAuthRes!} />}
          </div>
        </div>
      </div>
      <div className=" bg-red-50 p-4 w-1/2 mt-10">
        <div className="text-xl">
          SMS otp example
        </div>
        <div className="flex justify-between items-center"> <span className="w-16 inline-block">Phone:</span>
          <input className=" py-2 border-2 w-56 rounded-sm	" value={phone} onChange={(e) => { setPhone(e.target.value) }} type="text" />
          <Button onClick={authSMSOtp} className="w-40 ml-10">
            get otp
          </Button></div>
        <br />
        <div className="flex justify-between items-center">
          <span className="w-16 inline-block">otp: </span>
          <input className=" py-2 border-2 w-56	" value={smsOtp} onChange={(e) => { setSmsOtp(e.target.value) }} type="text" />

          <Button onClick={authSMSOtpConfirm} className="w-40 ml-10">
            confirm otp
          </Button>
        </div>
        <div>
          <div>
            {smsAuthRes && <ReactJson displayDataTypes={false} src={smsAuthRes!} />}
          </div>
        </div>
      </div>
      <div className=" bg-red-50 p-4 w-1/2 mt-10">
        <div className="text-xl py-4">
          Google oauth example
        </div>
        <GoogleOAuthProvider clientId="821654150370-q5hjra4s693p61l3giv7halqf42h37o1.apps.googleusercontent.com">
          <GoogleLoginCom onLoginSuccess={authGoogleOAuth}></GoogleLoginCom>
        </GoogleOAuthProvider>
        {oAuthRes && <ReactJson displayDataTypes={false} quotesOnKeys={false}  src={oAuthRes!} />}
      </div>

    </div>
  );

}

export default App;

