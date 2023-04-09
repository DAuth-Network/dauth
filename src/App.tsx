import Button from "./components/Button";
import useSignModal from "./hooks/useSignModal";
import useDauthModal from "./hooks/useDAuthModal";

function App() {
  const { Modal, showModal: showDauthModal } = useDauthModal()
  const { Modal: SignModal, showModal: showSignModal } = useSignModal()
  return (
    <div className="App">
      <Modal />
      <SignModal />
      <Button onClick={showDauthModal} className="w-64">
        show modal
      </Button>
      <Button onClick={showSignModal} className="w-64">
        show SignModal
      </Button>
    </div>
  );
}

export default App;
