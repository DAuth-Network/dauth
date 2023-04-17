import "@dauth/provider/index.css";
import {
  Button,
  useDauthModal,
  useEmailModal,
  useSignModal,
} from "@dauth/provider";

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
