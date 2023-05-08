import { FC, useState } from 'react'
import DAuthModal from '../components/Modal/DAuthModal'
import SignInItem from '../components/signInItem'
import { ISignInMethodItem } from '../types'
import ConnectLoading from '../components/ConnectLoding'
import { GoogleOAuthProvider } from '@react-oauth/google'
import GoogleOauth from '../components/OAuth/Google'
import { useEmailModal } from '..'
const signMethods: ISignInMethodItem[] = [
  {
    name: 'email',
    title: 'Email',
    description: 'Verify with your email',
  },
  {
    name: 'google',
    title: 'Google',
    description: 'www.google.com',
  },
  {
    name: 'twitter',
    title: 'Twitter',
    description: 'www.twitter.com',
  },
  {
    name: 'github',
    title: 'Github',
    description: 'www.github.com',
  },
  {
    name: 'facebook',
    title: 'Facebook',
    description: 'www.facebook.com',
  },
]
interface IModalProps {
  googleClientId?: string,
  onSuccess: (token: string) => void
}
const useSignModal = () => {
  const [modalShow, toggleModalShow] = useState(false)
  const [selectedItem, setselectedItem] = useState<ISignInMethodItem>()
  const { Modal: EmailModal, showModal: showEmailModal } = useEmailModal();

  const closeModal = () => {
    setselectedItem(undefined)
    toggleModalShow(false)
  }
  const showModal = () => {
    toggleModalShow(true)
  }
  const handleClick = (item: ISignInMethodItem) => {
    if (item.name === 'email') {
      closeModal()
      showEmailModal() 
    } if (item.name === 'google') {
      setselectedItem(item)
    } else {
      // TODO: other sign in method
    }
  }

  const Modal:FC<IModalProps> = ({googleClientId, onSuccess}) => {
    return (
      <>
        <EmailModal onSuccess={onSuccess} />
        <DAuthModal modalIsOpen={modalShow} closeModal={closeModal}>
          <div className="flex flex-col items-center">
            {selectedItem ? <GoogleOAuthProvider clientId={googleClientId!}>
              <ConnectLoading />
              <div className="text-2xl text-center my-4 font-semibold">Continue to sign in with Google</div>
              <div className="w-full px-4  text-sm text-white text-center my-4 mb-10">
                Return to Google sign-in window to continue authentication.
              </div>
              <GoogleOauth />
            </GoogleOAuthProvider> : <>
              <div className="text-2xl text-center my-4 font-semibold">Select your sign-in method</div>
              <div className="w-full px-4">
                {signMethods.map((item) => (
                  <SignInItem item={item} key={item.name} onClick={handleClick} />
                ))}
              </div>
            </>}
          </div>
        </DAuthModal>
      </>

    )
  }
  return {
    Modal,
    closeModal,
    showModal,
    modalShow,
  }
}

export default useSignModal
