import React, { FC, useState } from 'react'
import Button from '../Button'
import { isEmail } from '../../utils'
import { EStep } from '../../types'

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
          disabled={disabled}
          onChange={(e) => setEmail(e.target.value)}
          className={` rounded-full w-full bg-[#262629] text-[#999AA0] outline-none h-14 px-6 mb-5 disabled:cursor-not-allowed disabled:opacity-50 text-sm lg:text-base`}
          placeholder="Enter your email"
        />
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
