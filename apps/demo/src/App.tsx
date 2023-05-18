import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { useSignModal, Button } from "@dauth/dauth-provider";
import test from "@dauth/core";
import { useState } from "react";

function App() {
  const { Modal: SignModal, showModal: showSignModal, closeModal: closeSignModal } = useSignModal();
  const [token, setToken] = useState('')
  const handleSuccess = (token: string) => {
    // token is jwt token
    console.log(token)
    // TODO: handle token
    closeSignModal()
    setToken(token)
  }
 
  return (
    <div className="App">
      <SignModal onSuccess={handleSuccess} />
      <Button onClick={showSignModal} className="w-64">
        Login with Dauth
      </Button>
      <div className="text-black w-1/2 px-10">
        <h2 className=" text-lg py-10">
          login success, JWT token:
        </h2>
        {token}
      </div>
      <div>
        core:
        <Button onClick={test} className="w-64">
          test
        </Button>
      </div>
    </div>
  );

}

export default App;

