import React, { useState } from 'react'
import { FaEyeSlash } from 'react-icons/fa'
import { MdOutlineLock } from 'react-icons/md'
import DAuthModal from '../components/Modal/DAuthModal'
import SignInItem from '../components/signInItem'
import { ISignInMethodItem } from '../types'

const signMethods: ISignInMethodItem[] = [
    {
        name: 'email',
        title: 'Email',
        description: 'Verify with your email'
    },
    {
        name: 'google',
        title: 'Google',
        description: 'www.google.com'
    },
    {
        name: 'twitter',
        title: 'Twitter',
        description: 'www.twitter.com'
    },
    {
        name: 'github',
        title: 'Github',
        description: 'www.github.com'
    },
    {
        name: 'facebook',
        title: 'Facebook',
        description: 'www.facebook.com'
    }
]
const useSignModal = () => {
    const [modalShow, toggleModalShow] = useState(false)
    const closeModal = () => {
        toggleModalShow(false)
    }
    const showModal = () => {
        toggleModalShow(true)
    }

    const Modal = () => <DAuthModal modalIsOpen={modalShow} closeModal={closeModal} >
        <div className='flex flex-col items-center'>

            <div className='text-2xl text-center my-4 font-semibold'>
                Select your sign-in method
            </div>
            <div className='w-full px-4'>
                {
                    signMethods.map((item) => <SignInItem item={item} key={item.name} />)
                }
            </div>

        </div>

    </DAuthModal>
    return {
        Modal,
        closeModal,
        showModal,
        modalShow
    }
}

export default useSignModal