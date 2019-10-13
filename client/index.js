import GithubClient from './GithubClient.js'

(function() {
    const client = new GithubClient('8390933a81635970d3b6')
    let qs = queryStringToObj(window.location.search)
    
    // qs && console.log(qs.state, localStorage.getItem('ghStateToken'))

    if (qs
        && 'state' in qs
        && 'code' in  qs
        && qs.state === localStorage.getItem('ghStateToken')
        && !localStorage.getItem('ghToken'))
    {
        console.log('state matches')
        // use code to request token
        client.getToken(qs.code)
        .then(res => {
            console.log(res)
            let { access_token } = res
            return access_token && localStorage.setItem('ghToken', access_token)
        }).catch(er => {
            console.error(er)
        })
    } else if (localStorage.getItem('ghToken')) {
        let main = document.getElementById('main')
        let loginBtn = document.getElementById('gh-login')
        let h1 = document.createElement('h1')
        h1.innerText = 'Hi GH user (I gotta figure out how to retrieve your name)'
        main.removeChild(loginBtn)
        main.appendChild(h1)
    } else {
        client.appendStateToAnchor('gh-login')
    }
})()

// only takes simple query strings in the shape like
// ?xxx=yyy&aaa=bbb
function queryStringToObj(qs) {
    if (!qs) return qs
    if (qs.startsWith('?')) qs = qs.slice(1)
    if (!qs) return qs

    let pieces = qs.split('&')
    return pieces.reduce((obj, piece) => {
        let [ key, val ] = piece.split('=')
        obj[key] = val
        return obj
    }, {})
}
