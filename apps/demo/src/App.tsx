import "@dauth/dauth-provider/dist/style.css";
import "@dauth/dauth-provider/dist/tailwind.css";
import { useDauthModal, useSignModal, useEmailModal, Button } from "@dauth/dauth-provider";

function App() {
  const { Modal, showModal: showDauthModal } = useDauthModal();
  const { Modal: SignModal, showModal: showSignModal } = useSignModal();
  const { Modal: EmailModal, showModal: showEmailModal } = useEmailModal();
  return (
    <div className="App">
      <Modal />
      <SignModal />
      <EmailModal />
      <Button onClick={showDauthModal} className="w-64">
        show modal
      </Button>
      <div className=" text-red-300">12312</div>
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
