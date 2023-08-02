import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { FC } from 'react';
import {Button} from "@/components/ui/button";


interface IGoogleLoginComProps {
    onLoginSuccess: (token: string) => void
}
const GoogleLoginCom: FC<IGoogleLoginComProps> = ({ onLoginSuccess }) => {
    const login = useGoogleLogin({
        onSuccess: onSuccess,
        flow: 'auth-code',
    });
    function onSuccess(codeResponse: CodeResponse) {
        const code = codeResponse.code
        onLoginSuccess(code)
    }
    return (

        <Button className='px-10 ml-10' onClick={() => login()}>
            Login with google
        </Button>
    )
}
export default GoogleLoginCom