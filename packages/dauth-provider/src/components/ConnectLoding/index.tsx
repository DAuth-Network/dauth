import Logo from "../../assets/demo-logo.png"
import { BeatLoader } from "react-spinners"
import GoogleIcons from "../Icons/GoogleIcons"
const ConnectLoading = () => {
    return (
        <div className="flex justify-center items-center gap-5">
            <GoogleIcons/>
            <BeatLoader color="#fff" />
            <img className="w-16" src={Logo} alt="" />
        </div>
    )
}

export default ConnectLoading 