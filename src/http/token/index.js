let ghClient = require('github-client')

exports.token = async (req, res) => {
    console.log(req.body)
    if (req.method !== 'POST')
        return res.status(405).send('nop')

    if (!req.body.code)
        return res.status(400).send({ message: 'pearljam.com/music/album/no-code' })

    let gh = new ghClient(process.env.GH_CLIENT_ID, process.env.GH_CLIENT_SECRET)

    let response
    try {
        response = await gh.getToken(req.body.code)
        console.log('token returned from gh-client', response.access_token)

        if (response.error) throw response
    } catch (error) {
        /**
         * { error: 'bad_verification_code',
         * error_description: 'The code passed is incorrect or expired.' }
         */
        // what kinds of errors might come from GH?
        // what is error code for "token expired"?
        let status = +error.status || 500
        console.error('Error:', error)
        return res.status(status).send({ error: error.error_description })
    }

    res.json(response)
}