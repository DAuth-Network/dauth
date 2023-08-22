import { Button } from "./ui/button";


const TwitterLogin = () => {
    const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    function getTwitterOauthUrl() {
        const rootUrl = "https://twitter.com/i/oauth2/authorize";
        const options = {
            redirect_uri: `${origin}/redirect/twitter`,
            client_id: TWITTER_CLIENT_ID,
            state: "state",
            response_type: "code",
            code_challenge: "challenge",
            code_challenge_method: "plain",
            scope: ["users.read", "tweet.read"].join(" "), // add/remove scopes as needed
        };
        const qs = new URLSearchParams(options).toString();
        return `${rootUrl}?${qs}`;
    }
    const onClick = () => {
        const url = getTwitterOauthUrl();
        window.open(url, "_self")
    }
    return (
        <div>
            <Button onClick={onClick}>
                Login twitter
            </Button>
        </div>
    )
}

export default TwitterLogin