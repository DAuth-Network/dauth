import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { Button } from "@dauth/dauth-provider";
import ReactJson from 'react-json-view'
import DAuth from "@dauth/core";
import { useState } from "react";
import { IOtpConfirmReturn } from "@dauth/core/dist/types";
const dauth = new DAuth('https://dev-api.dauth.network/dauth/sdk/v1.1/')
function App() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [res, setRes] = useState<IOtpConfirmReturn>()
  const authOtp = async () => {
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
  const authOtpConfirm = async () => {
    try {
      const res = await dauth.service.authOptConfirm({
        code,
        request_id: 'test'
      })
      console.log(res)
      setRes(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <div>
        email:
        <input className=" py-2 border-2	" value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" />
        <Button onClick={authOtp} className="w-32 ml-10">
          auth
        </Button>
        <br />
        <br />
        code:
        <input className=" py-2 border-2	" value={code} onChange={(e) => { setCode(e.target.value) }} type="text" />

        <Button onClick={authOtpConfirm} className="w-32 ml-10">
          confirm code
        </Button>
        <div>
          res:
          <div>
            {res && <ReactJson src={res!} />}
          </div>
        </div>
      </div>
    </div>
  );

}

export default App;

