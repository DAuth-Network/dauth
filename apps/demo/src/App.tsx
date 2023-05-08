import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { useSignModal, Button } from "@dauth/dauth-provider";

function App() {
  const { Modal: SignModal, showModal: showSignModal } = useSignModal();
  const handleSuccess = (token: string) => {
    // token is jwt token
    console.log(token)
    // TODO: handle token
  }
  return (
    <div className="App">
      <SignModal googleClientId="821654150370-regko070lj9uepk3krh09m8tpth2364h.apps.googleusercontent.com" onSuccess={handleSuccess} />
      <Button onClick={showSignModal} className="w-64">
        Login with Dauth
      </Button>
    </div>
  );

}

export default App;

