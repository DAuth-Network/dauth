import { useGoogleLogin } from '@react-oauth/google';
import { loginWithOauth } from '../../services/http';
import { exchangeKeyAndEncrypt } from '../../utils/crypt';
import Button from '../Button';



const GoogleOauth = () => {
    const onSuccess = async (res: any) => {
        const code = res.code
        try {
            const { session_id, cipher_code } = await exchangeKeyAndEncrypt(code)
            await loginWithOauth({ cipher_code: cipher_code!, session_id, oauth_type: 'google' })
        } catch (error) {
            console.log(error)
        } finally {
        }

    }


    const login = useGoogleLogin({
        onSuccess,
        flow: 'auth-code',
        onNonOAuthError(nonOAuthError) {
            console.log(nonOAuthError)
        },
    });


    return (
        <Button className='w-full ' onClick={login} >
            Continue
        </Button>
    )
}

export default GoogleOauth