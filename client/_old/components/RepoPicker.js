export default class RepoPicker extends HTMLSelectElement {
    constructor(repos, { id }) {
        super()

        let options = repos.map(repo => {
            let opt = document.createElement('option')
            opt.innerText = repo.name
            opt.value = repo.html_url
            return opt
        })

        this.id = id

        this.addEventListener('change', ev => {
            let url = ev.target.selectedOptions[0].value
            console.log(url)
        })

        this.append(...options)
    }
}

customElements.define('repo-picker', RepoPicker, { extends: 'select' })