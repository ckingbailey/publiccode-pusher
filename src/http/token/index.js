let ghClient = require('github-client')

exports.token = async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).send('nop')

    if (!req.body.code)
        return res.status(400).send('pearljam.com/music/album/no-code')

    let gh = new ghClient(process.env.GH_CLIENT_ID, process.env.GH_CLIENT_SECRET)

    let access_token, error
    try {
        { access_token, error } = await gh.getToken(req.body.code)

        if (error) throw error
    } catch (error) {
        console.error(error)
        return res.status(500).send('something went wrong')
    }


    res.json(access_token)
}