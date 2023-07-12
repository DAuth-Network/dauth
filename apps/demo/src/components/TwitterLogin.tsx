
const TWITTER_CLIENT_ID = 'bG1uckxTUlJOVEk3ZjlsaU1NelE6MTpjaQ'
const TwitterLogin = () => {

    function getTwitterOauthUrl() {
        const rootUrl = "https://twitter.com/i/oauth2/authorize";
        const options = {
            redirect_uri: "https://demo-api.dauth.network/redirect/twitter",
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
            <button onClick={onClick}>
                Login twitter
            </button>
        </div>
    )
}

export default TwitterLogin