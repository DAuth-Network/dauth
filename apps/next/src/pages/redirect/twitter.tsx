import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TwitterRedirect = () => {
    const router = useRouter();
    const query = router;
    // useEffect(() => {
    //     const code = searchParams.get('code')
    //     if (code) {
    //         navigate({
    //             pathname: "/sdk",
    //             search: `?${createSearchParams({
    //                 twitterAuth: code
    //             })}`
    //         });
    //     }
    // }, [searchParams])
    return (
        <div>redirecting...</div>
    )
}

export default TwitterRedirect