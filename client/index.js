import App from './App.js'

(async function() {
    let root = document.getElementById('main')
    
    let app = new App(root)
    await app.initialize()
    app.render()
})()
