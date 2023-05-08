import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { useDauthModal, useSignModal, useEmailModal, Button } from "@dauth/dauth-provider";

function App() {
  const { Modal, showModal: showDauthModal } = useDauthModal();
  const { Modal: SignModal, showModal: showSignModal } = useSignModal();
  const { Modal: EmailModal, showModal: showEmailModal } = useEmailModal();
  const handleSuccess = (token: string) => {
    // token is jwt token
    console.log(token)
    // TODO: handle token
  }
  return (
    <div className="App">
      <Modal />
      <SignModal googleClientId="821654150370-regko070lj9uepk3krh09m8tpth2364h.apps.googleusercontent.com" onSuccess={handleSuccess} />
      <EmailModal onSuccess={handleSuccess} />
      <Button onClick={showDauthModal} className="w-64">
        show modal
      </Button>
      <Button onClick={showSignModal} className="w-64">
        show SignModal
      </Button>
      <Button onClick={showEmailModal} className="w-64">
        show SignModal
      </Button>
    </div>
  );

}

export default App;
