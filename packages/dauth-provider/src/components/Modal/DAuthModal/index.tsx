import Button from '../../Button'
import Logo from '../../Logo/Logo'
import React, { FC, ReactNode } from 'react'

interface IDAuthModal {
  modalIsOpen: boolean
  closeModal: () => void
  children: ReactNode
  onConfirm?: () => void
}

const DAuthModal: FC<IDAuthModal> = ({ modalIsOpen, children, closeModal, onConfirm }) => {
  const handleConfirm = () => {
    closeModal()
    onConfirm && onConfirm!()
  }
  return (
    <div
      onClick={closeModal}
      className={`main-modal  fixed w-full h-100 inset-0 z-50 overflow-hidden  justify-center items-center animated fadeIn faster ${
        modalIsOpen ? 'flex' : 'hidden'
      }`}
      style={{ background: 'rgba(0,0,0,.7)' }}
    >
      <div
        className="shadow-lg modal-container w-full md:max-w-sm md:max-h-auto bg-black  mx-auto rounded-lg h-full md:h-auto  z-50 overflow-y-auto"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <Logo className="w-full" />
            <div className="modal-close cursor-pointer z-50" onClick={closeModal}>
              <svg
                className="fill-current text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="px-4">
            <div className="w-full my-5  flex flex-col justify-center items-center">{children}</div>
            {!!onConfirm && (
              <div className="w-full">
                <Button className="focus:outline-none modal-close w-full " onClick={handleConfirm}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DAuthModal
