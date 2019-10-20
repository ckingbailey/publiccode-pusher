let rp = require('request-promise')

module.exports = function GithubClient(client_id, client_secret) {
    async function getToken(code) {
        let uri = 'https://github.com/login/oauth/access_token'
        let body = {
            client_id,
            code,
            client_secret
        }
        
        console.log('preparing to send body', body)
        let response = await rp({
            uri,
            method: 'POST',
            headers: { Accept: 'application/json' },
            body,
            json: true
        })
        console.log(response)
        return response
    }

    return { getToken }
}