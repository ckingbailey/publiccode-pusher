let ghClient = require('./github-client')

exports.token = async (req, res) => {
    let allowedOrigin = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://ckingbailey.github.io'
    res.set('Access-Control-Allow-Origin', allowedOrigin)
    if (req.method !== 'POST')
        return res.status(405).json({ message: 'nop' })

    if (!req.body.code)
        return res.status(400).json({ message: 'pearljam.com/music/album/no-code' })

    let gh = new ghClient(process.env.GH_CLIENT_ID, process.env.GH_CLIENT_SECRET)

    let response
    try {
        // TODO: resolveWithFullResponse here so that I can use GH response statusCode
        response = await gh.getToken(req.body.code)

        if (response.error) throw response
    } catch (error) {
        /**
         * example error:
         * { error: 'bad_verification_code',
         * error_description: 'The code passed is incorrect or expired.' }
         */
        let status = +error.status || 500
        if (status === 500 && error.error === 'bad_verification_code')
            status = 400
        
        if (!error.message)
            error = {
                code: error.error,
                message: error.error_description
            }

        console.error('Error: ', error)
        return res.status(status).json(error)
    }

    res.json(response)
}