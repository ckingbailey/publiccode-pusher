export default function Banner({ info, warning, error }) {
    let banner = document.createElement('h2')
    banner.innerText = warning
    banner.style.backgroundColor = 'yellow'

    return banner
}