export default function Banner({ type, text }, children) {
    let banner = document.createElement('h2')
    banner.innerText = text
    banner.style.backgroundColor = getBackgroundColor(type)

    for (let component of children) {
        banner.appendChild(component)
    }    

    return banner
}

function getBackgroundColor(type) {
    switch (type) {
        case 'info': return 'green'
        case 'warning': return 'yellow'
        case 'error': return 'red'

    }
}