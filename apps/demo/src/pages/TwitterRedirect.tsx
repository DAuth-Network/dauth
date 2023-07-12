import { useEffect } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

const TwitterRedirect = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const code = searchParams.get('code')
        if (code) {
            navigate({
                pathname: "/sdk",
                search: `?${createSearchParams({
                    twitterAuth: code
                })}`
            });
        }
    }, [searchParams])
    return (
        <div>redirecting...</div>
    )
}

export default TwitterRedirect