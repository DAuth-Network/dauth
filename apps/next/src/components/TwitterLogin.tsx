import { Button } from "./ui/button";

const TWITTER_CLIENT_ID = 'R2dTdmg3cl94ajVSdTBWc1MtU0Y6MTpjaQ'
const TwitterLogin = () => {

    function getTwitterOauthUrl() {
        const rootUrl = "https://twitter.com/i/oauth2/authorize";
        const options = {
            redirect_uri: "https://dev-api.dauth.network/redirect/twitter",
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