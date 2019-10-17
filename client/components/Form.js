export default function Form() {
    let fragment = new DocumentFragment()

    let form = document.createElement('form')
    form.id = 'schema-form'
    fragment.appendChild(form)

    form.appendChild(document.createElement('input'))
    return fragment
}