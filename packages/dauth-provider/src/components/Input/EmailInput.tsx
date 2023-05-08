import { FC, useState } from 'react'
import Button from '../Button'
import { isEmail } from '../../utils'
import { EStep } from '../../types'
import { FaEyeSlash } from 'react-icons/fa'

interface IEmailInput {
  onSubmit: (email: string) => void
  step: EStep
}

const EmailInput: FC<IEmailInput> = ({ onSubmit, step }) => {
  const [email, setEmail] = useState('')
  const disabled = step > EStep.default
  const handleSubmit = () => {
    isEmail(email) && onSubmit(email)
  }
  return (
    <>
      <div>
        <input
          type={'password'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={` rounded-full w-full bg-[#262629] text-[#999AA0] outline-none h-14 px-6 mb-5 disabled:cursor-not-allowed disabled:opacity-50 text-sm lg:text-base`}
          placeholder="Enter your email"
        />
        <div className='flex justify-center flex-row items-center mb-24'>
          <div className='icon'>
            <FaEyeSlash className='w-16' />
          </div>
          <div className='text-sm'>
            Your email is hidden from everyone, including DAuth.
          </div>
        </div>
        <Button
          disabled={disabled}
          className={`w-full text-sm lg:text-base`}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </>
  )
}

export default EmailInput
