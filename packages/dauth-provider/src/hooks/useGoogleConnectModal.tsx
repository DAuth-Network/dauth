import { useState } from 'react'
import DAuthModal from '../components/Modal/DAuthModal'

const useGoogleConnectModal = () => {
  const [modalShow, toggleModalShow] = useState(false)
  const closeModal = () => {
    toggleModalShow(false)
  }
  const showModal = () => {
    toggleModalShow(true)
  }

  const Modal = ({ onConfirm }: any) => (
    <DAuthModal modalIsOpen={modalShow} closeModal={closeModal} onConfirm={onConfirm}>
      s

    </DAuthModal>
  )
  return {
    Modal,
    closeModal,
    showModal,
    modalShow,
  }
}

export default useGoogleConnectModal
