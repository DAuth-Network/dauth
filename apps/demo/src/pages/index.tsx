import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export const Home = () => {
    const navigate = useNavigate()

    return (
        <div>

            <div>
                <Button onClick={() => {
                    navigate("/sdk");
                }}>SDK DEMO</Button>
               
            </div>

        </div>
    )
}
