export default function Form({ username, repos }) {
    let fragment = new DocumentFragment()

    let form = document.createElement('form')
    form.id = 'schema-form'
    fragment.appendChild(form)

    form.appendChild(document.createElement('input'))

    if (username) {
        let user = document.createElement('h1')
        user.innerText = username
        fragment.insertBefore(user, form)
    }

    if (repos) {
        let repoList = document.createElement('pre')
        repoList.innerText = JSON.stringify(repos.map(repo => repo.name), null, 2)
        fragment.insertBefore(repoList, form)
    }
    return fragment
}