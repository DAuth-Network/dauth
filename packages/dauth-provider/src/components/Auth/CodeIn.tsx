import { useCountDown, useRequest } from 'ahooks'
import { FC, useRef, useState } from 'react'
import AuthCode, { AuthCodeRef } from 'react-auth-code-input'
import { FiMail } from 'react-icons/fi'
import { sleep } from '../../utils'
import exchangeKey from '../../services/exchangeKey'
import { decrypt, encrypt } from '../../utils/crypt'
import { dauth_confirmRegisteredEmail } from '../../services/http'

interface ICodeIn {
  email: string
  resend: () => Promise<void>
  onSuccess: (token: string) => void
  show?: boolean
}

const coldDown = 60 * 1000

enum Estep {
  failed = -1,
  ready,
  success,
}

const inputClasses: any = {
  [Estep.success]: 'bg-[#1d322a] text-[#40aa84] border-[#40aa84]',
  [Estep.failed]: 'bg-[#3f292c] text-[#EE736F] border-[#EE736F]',
  [Estep.ready]: ' bg-[#262629] text-white border-[#383838]',
}
const CodeIn: FC<ICodeIn> = ({ email, resend, onSuccess, show = false }) => {
  const AuthInputRef = useRef<AuthCodeRef>(null)
  const [code, setResult] = useState('')
  const [targetDate, setTargetDate] = useState(Date.now() + coldDown)
  const [resendShow, setResendShow] = useState(false)
  const [status, setStatus] = useState(Estep.ready)
  const [isLoading, setIsLoading] = useState(false)
  const handleOnChange = (res: string) => {
    setStatus(Estep.ready)

    setResult(res)
  }
  const [, formattedRes] = useCountDown({
    targetDate,
    onEnd: () => {
      setResendShow(true)
    },
  })
  const onResend = async () => {
    setResendShow(false)
    AuthInputRef.current?.clear()
    AuthInputRef.current?.focus()
    setStatus(Estep.ready)
    setTargetDate(Date.now() + coldDown)
    await resend()
  }
  const submitCode = async () => {
    try {
      setIsLoading(true)
      const { session_id, shareKey } = await exchangeKey.exchange()
      const cipher_code = await encrypt(code, shareKey)
      const res = await dauth_confirmRegisteredEmail({ cipher_code, session_id })

      const userinfo_cipher_token = res.cipher_token
      const token = decrypt(userinfo_cipher_token, shareKey)
      onSuccess(token!)
      await sleep(1)
      setIsLoading(false)
      setStatus(Estep.success)
      await sleep(0.5)
    } catch (error) {
      setIsLoading(false)
      setStatus(Estep.failed)
    }
  }
  useRequest(submitCode, {
    ready: code.length === 6,
    debounceWait: 200,
  })

  return (
    <div className="flex flex-col justify-center items-center w-full ">
      <div className="text-center my-4">
        <div className="text-xl font-semibold">Confirm verification code</div>
        <div className=" text-sm text-[#ffffff80]">We&apos;ve sent a code to</div>
        <div>{email}</div>
      </div>
      <div className="mt-6">
        <div >
          <AuthCode
            ref={AuthInputRef}
            isPassword={!show}
            allowedCharacters="numeric"
            containerClassName="flex w-full justify-evenly"
            inputClassName={`lg:w-10 lg:h-10 w-10 h-10 mx-2 last:mr-0 rounded-xl outline-none text-center border  lg:text-[22px] text-[20px] ${inputClasses[status]}`}
            onChange={handleOnChange}
          />
          <div className="mt-10 text-center  text-sm font-semibold">
            {status === Estep.ready && (
              <>
                <span className="text-[#898989] inline-block mr-1 ">Didn&apos;t receive it?</span>
                {resendShow ? (
                  <span className="text-main cursor-pointer" onClick={onResend}>
                    Resend
                  </span>
                ) : (
                  <span className="text-main">{formattedRes.seconds}s</span>
                )}
              </>
            )}
            {status === Estep.success && (
              <span className="text-[#40AA84] inline-block mr-1">
                Wecome! <span className="text-xl">🎉</span>
              </span>
            )}
            {status === Estep.failed && (
              <div className=" text-sm">
                <div className="text-[#CB6462] inline-block mr-1">
                  Incorrect code. Please try again.
                </div>
                <div>
                  <span className="text-[#898989] inline-block mr-1">Didn&apos;t receive it?</span>
                  {resendShow ? (
                    <span className="text-main cursor-pointer" onClick={onResend}>
                      Resend
                    </span>
                  ) : (
                    <span className="text-main">{formattedRes.seconds}s</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeIn
