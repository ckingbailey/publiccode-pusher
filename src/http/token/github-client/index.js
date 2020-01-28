let rp = require('request-promise')

module.exports = function GithubClient(client_id, client_secret) {
    if (!client_id) throw Error('client_id is undefined')
    if (!client_secret) throw Error('client_secret is undefined')

    async function getToken(code) {
        if (!code) throw Error('code is undefined')
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
        console.log('got response', response)
        return response
    }

    return { getToken }
}