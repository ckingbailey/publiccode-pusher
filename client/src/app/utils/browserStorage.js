export function getRepoFromBrowserStorage() {
    let target = window.sessionStorage.getItem('target_repo') // grab repo url that was stored before redirect to GitHub auth page
    let [ owner, repo ] = target.replace(/https*:\/\/github.com\//, '').split('/')
    return { owner, repo }
}