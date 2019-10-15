import Banner from './Banner.js'

export default function Form({ warning }) {
    let fragment = new DocumentFragment()

    let form = document.createElement('form')
    form.id = 'schema-form'
    fragment.appendChild(form)

    let warningBanner = warning && new Banner({ warning })
    warningBanner && fragment.insertBefore(warningBanner, form)

    form.appendChild(document.createElement('input'))
    return fragment
}