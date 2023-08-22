import { useEffect } from "react";
import { useRouter } from 'next/router'

const TwitterRedirect = () => {
    const router = useRouter();
    const code = router.query.code;
    if (code) {
        router.push({
            pathname: "/",
            query: { twitterAuth: code },
        });
    }
    return (
        <div>redirecting...</div>
    )
}

export default TwitterRedirect