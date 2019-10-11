let ghClient = require('github-client')

exports.token = async (req, res) => {
    console.log(req.body)
    if (req.method !== 'POST')
        return res.status(405).send('nop')

    if (!req.body.code)
        return res.status(400).send('pearljam.com/music/album/no-code')

    let gh = new ghClient(process.env.GH_CLIENT_ID, process.env.GH_CLIENT_SECRET)

    let response
    try {
        response = await gh.getToken(req.body.code)
        console.log('token returned from gh-client', response.access_token)

        if (response.error) throw response.error
    } catch (error) {
        console.error(error)
        return res.status(500).send('something went wrong')
    }

    res.json(response)
}