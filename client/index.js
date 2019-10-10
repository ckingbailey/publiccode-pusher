import GithubClient from './GithubClient.js'

const client = new GithubClient('8390933a81635970d3b6')
let qs = queryStringToObj(window.location.search)

if (qs
    && 'state' in qs
    && qs.state !== null
    && qs.state === window.localStorage.getItem('state')
    && 'code' in  qs)
{
    // use code to request token
    client.getToken(qs.code)
} else {
    client.appendStateToAnchor('gh-login')
}

// only takes simple query strings in the shape like
// ?xxx=yyy&aaa=bbb
function queryStringToObj(qs) {
    if (!qs) return null
    if (qs.startsWith('?')) qs = qs.slice(1)
    if (!qs) return {}

    let pieces = qs.split('&')
    return pieces.reduce((obj, piece) => {
        let [ key, val ] = piece.split('=')
        obj[key] = val
        return obj
    }, {})
}