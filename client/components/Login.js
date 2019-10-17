export default function Login({ text, id, client_id, stateToken }) {
    let scope = 'public_repo%20read:user'
    let a = document.createElement('a')
    
    a.id = id
    
    a.setAttribute('href', 'https://github.com/login/oauth/authorize?client_id='
    + client_id
    + '&scope='
    + scope
    + '&state='
    + stateToken)

    a.innerText = text

    return a
}