import React, { useState } from 'react'
import DAuthModal from '../components/Modal/DAuthModal'
import EmailInput from '../components/Input/EmailInput'
import { EStep } from '../types'
import CodeIn from '../components/Auth/CodeIn'
import { sleep } from '../utils'
import exchangeKey from '../services/exchangeKey'
import { dauth_registerEmail } from '../services/http'
import { encrypt } from '../utils/crypt'
import { useRequest } from 'ahooks'

const loadingtexts = [
    '',
    'Establishing a secure connection with DAuth node',
    'Encrypting your email',
    'Hiding your identity'
]
const useEmailModal = () => {
    const [modalShow, toggleModalShow] = useState(false)
    const [email, setEmail] = useState('')
    const [step, setStep] = useState(0)
    const [loadingStep, setLoadingStep] = useState(EStep.default)
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

            await dauth_registerEmail({ cipher_email: cipher_email!, session_id })
            await sleep()
            setEmail(email)
            setStep(1)
            setLoadingStep(EStep.default)
        } catch (error) {
            console.log(error)

        }
    }
    const { refreshAsync } = useRequest(handleSubmit, {
        manual: true
    });

    const Modal = () => <DAuthModal modalIsOpen={modalShow} closeModal={closeModal} isLoading={step === 0 && loadingStep > EStep.default} loadingText={loadingtexts[loadingStep]} >
        <div className='flex flex-col items-center'>
            <img src={require('./demo-logo2.png')} width={180} height={100} alt='' />
        </div>
        <div>

        </div>
        <div className='w-full h-full'>
            {
                step === 0 && <div>
                    <div className='text-2xl text-center my-4 font-semibold'>
                        Signing in with email
                    </div>
                    <EmailInput onSubmit={handleSubmit} step={EStep.default}></EmailInput>
                </div>
            }
            {
                step === 1 && <CodeIn email={email} resend={refreshAsync} />

            }

        </div>

    </DAuthModal>
    return {
        Modal,
        closeModal,
        showModal,
        modalShow
    }
}

export default useEmailModal