import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { Button } from "@dauth/dauth-provider";
import DAuth from "@dauth/core";
import { useState } from "react";
const dauth = new DAuth()
function App() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const authOtp = async () => {
    try {
      await dauth.service.authOpt(email, 'email', 'test')
    } catch (error) {
      console.log(error)
    }
  }
  const authOtpConfirm = async () => {
    try {
      const res = await dauth.service.authOptConfirm(code, 'test')
      console.log(res)
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
      </div>
    </div>
  );

}

export default App;

