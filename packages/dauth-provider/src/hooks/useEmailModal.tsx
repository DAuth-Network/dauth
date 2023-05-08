import { FC, useState } from 'react'
import DAuthModal from '../components/Modal/DAuthModal'
import EmailInput from '../components/Input/EmailInput'
import { EStep } from '../types'
import CodeIn from '../components/Auth/CodeIn'
import { sleep } from '../utils'
import exchangeKey from '../services/exchangeKey'
import { dauth_registerEmail } from '../services/http'
import { encrypt } from '../utils/crypt'
import { useRequest } from 'ahooks'
import logo from "../assets/demo-logo2.png"
import { BeatLoader } from 'react-spinners'
interface ISignModal{
  onSuccess: (token: string) => void
}
const useEmailModal = () => {
  const [modalShow, toggleModalShow] = useState(false)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(0)
  const [loadingStep, setLoadingStep] = useState(EStep.default)
  const closeModal = () => {
    setStep(0)
    setLoadingStep(EStep.default)
    toggleModalShow(false)
  }
  const showModal = () => {
    toggleModalShow(true)
  }
  // const handleSubmit = (e: string) => {
  //     console.log(e)
  // }
  const handleSubmit = async (email: string) => {
    try {
      setStep(1)
      setLoadingStep(EStep.exchange)
      await sleep()
      const { session_id, shareKey } = await exchangeKey.exchange()
      setLoadingStep(EStep.encrypt)
      await sleep()
      const cipher_email = await encrypt(email, shareKey)
      setLoadingStep(EStep.hiding)

      await dauth_registerEmail({ cipher_email: cipher_email!, session_id })
      setLoadingStep(EStep.success)
      await sleep()
      setEmail(email)
      setStep(2)
    } catch (error) {
      console.log(error)
    }
  }
  const { refreshAsync } = useRequest(handleSubmit, {
    manual: true,
  })
 
  const Modal: FC<ISignModal> = ({onSuccess}) => (
    <DAuthModal modalIsOpen={modalShow} closeModal={closeModal}>
      <div className="flex flex-col items-center">
        {
          step !== 1 && <img src={logo} width={180} height={100} alt="" />
        }
        {
          step === 0 && <div className="text-lg text-center my-4">Signing in with email</div>
        }
      </div>
      <div className="w-full">
        {step === 0 && <EmailInput onSubmit={handleSubmit} step={EStep.default}></EmailInput>}
        {step === 2 && <CodeIn email={email} resend={refreshAsync} onSuccess={onSuccess} />}
        {/* <div className='mt-6 flex-none'>
                    <StepLoading show={show} step={loadingStep} toggleShow={setShow} />
                </div> */}
      </div>
      {
        step === 1 && <div className='flex flex-col justify-center items-center'>
          <BeatLoader color="#fff" />

          {
            loadingStep <= EStep.exchange &&
            <div className="text-sm text-center my-4  text-light-grey">Establishing a secure connection with DAuth node</div>
          }
          {
            loadingStep === EStep.encrypt &&
            <div className="text-sm text-center my-4  text-light-grey">Encrypting your email</div>
          }
          {
            loadingStep >= EStep.hiding &&
            <div className="text-sm text-center my-4  text-light-grey">Hiding your identity</div>
          }
        </div>
      }
    </DAuthModal>
  )
  return {
    Modal,
    closeModal,
    showModal,
    modalShow,
  }
}

export default useEmailModal
