export default function Login({ client_id, state }) {
    let scope = 'public_repo%20user:read'
    let a = document.createElement('a')
    
    a.id = 'gh-login'
    
    a.setAttribute('href', 'https://github.com/login/oauth/authorize/client_id='
    + client_id
    + '&scope='
    + scope
    + '&state='
    + state)

    a.innerText = 'Login to Github'

    return a
}