import React, { useState } from 'react'
import { FaEyeSlash } from 'react-icons/fa'
import { MdOutlineLock } from 'react-icons/md'
import DAuthModal from '../components/Modal/DAuthModal'

const useDauthModal = () => {
  const [modalShow, toggleModalShow] = useState(false)
  const closeModal = () => {
    toggleModalShow(false)
  }
  const showModal = () => {
    toggleModalShow(true)
  }

  const Modal = ({ onConfirm }: any) => (
    <DAuthModal modalIsOpen={modalShow} closeModal={closeModal} onConfirm={onConfirm}>
      <div className="flex flex-col items-center">
        <img src={require('./demo-logo.png')} width={100} height={100} alt="" />

        <div className="text-lg text-center my-4">
          Authenticate your identity anonymously with the{' '}
          <div className=" font-semibold">DAuth Network.</div>
        </div>
        <div>
          <div className="flex items-center justify-around my-2">
            <div className="icon">
              <FaEyeSlash className="w-16" />
            </div>
            <div className="flex flex-col">
              <h4 className="font-semibold py-1">Incognito Identity</h4>
              <div className="font-light">
                Your email remains hidden from everyone, including DAuth.
              </div>
            </div>
          </div>
          <div className="flex items-center justify-around my-2">
            <div className="icon">
              <MdOutlineLock className="w-16 font-semibold" size={24} />
            </div>
            <div className="flex flex-col">
              <h4 className="font-semibold py-1">Self-controlled Data</h4>
              <div className="font-light">Control access to any site with DAuth.</div>
            </div>
          </div>
        </div>
      </div>
    </DAuthModal>
  )
  return {
    Modal,
    closeModal,
    showModal,
    modalShow,
  }
}

export default useDauthModal
