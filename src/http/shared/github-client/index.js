let rp = require('request-promise')

module.exports = function GithubClient(clientId, clientSecret) {
    async function getToken(code) {
        let uri = 'https://github.com/login/oauth/access_token'
        let body = `client_id=${clientId}&code=${code}&client_secret=${clientSecret}`
        try {
            let response = await rp({
                uri,
                method: 'POST',
                headers: { Accept: 'application/json' },
                body
            })
            return (await response).access_token
        } catch (error) {
            return { error }
        }
    }

    return { getToken }
}