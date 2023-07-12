import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate()

    return (
        <div>

            <div>
                <button onClick={() => {
                    navigate("/sdk");
                }}>SDK DEMO</button>
                <button onClick={() => {
                    navigate("/stress");
                }}>Stress test</button>
            </div>

        </div>
    )
}
