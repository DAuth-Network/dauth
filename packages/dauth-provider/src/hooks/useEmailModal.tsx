import { useState } from 'react'
import DAuthModal from '../components/Modal/DAuthModal'
import EmailInput from '../components/Input/EmailInput'
import { EStep } from '../types'
import CodeIn from '../components/Auth/CodeIn'
import { sleep } from '../utils'
import exchangeKey from '../services/exchangeKey'
import { dauth_registerEmail } from '../services/http'
import { encrypt } from '../utils/crypt'
import { useRequest } from 'ahooks'
import logo from "./demo-logo2.png"
const useEmailModal = () => {
  const [modalShow, toggleModalShow] = useState(false)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(0)
  const [, setLoadingStep] = useState(EStep.default)
  const closeModal = () => {
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
      setLoadingStep(EStep.exchange)
      await sleep()
      const { session_id, shareKey } = await exchangeKey.exchange()
      setLoadingStep(EStep.encrypt)
      await sleep()
      const cipher_email = await encrypt(email, shareKey)
      setLoadingStep(EStep.hiding)

      await dauth_registerEmail({ cipher_email, session_id })
      setLoadingStep(EStep.success)
      await sleep()
      setEmail(email)
      setStep(1)
      setLoadingStep(EStep.default)
    } catch (error) {
      console.log(error)
    }
  }
  const { refreshAsync } = useRequest(handleSubmit, {
    manual: true,
  })

  const Modal = () => (
    <DAuthModal modalIsOpen={modalShow} closeModal={closeModal}>
      <div className="flex flex-col items-center">
        <img src={logo} width={180} height={100} alt="" />

        <div className="text-lg text-center my-4">Signing in with email</div>
      </div>
      <div></div>
      <div className="w-full">
        {step === 0 && <EmailInput onSubmit={handleSubmit} step={EStep.default}></EmailInput>}
        {step === 1 && <CodeIn email={email} resend={refreshAsync} />}
        {/* <div className='mt-6 flex-none'>
                    <StepLoading show={show} step={loadingStep} toggleShow={setShow} />
                </div> */}
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

export default useEmailModal
