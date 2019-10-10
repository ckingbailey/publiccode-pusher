module.exports = (req, res) => {
    console.log(req)
    
    if (req.method !== 'POST') {
        return res.status(405).send('nop')
    }

    if (!req.body.code) {
        return res.status(400).send('pearljam.com/music/album/no-code')
    }

    res.send(req.body.code)
}