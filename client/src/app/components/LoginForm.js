import React from 'react'

const LoginForm = props => (
    <form
        action={ `https://github.com/login/oauth/authorize` }
        method='GET'
        onSubmit={ () => sessionStorage.setItem('target_repo', props.targetRepo) }
    > 
        <input type="hidden" name="client_id" value="8390933a81635970d3b6" />
        <input type="hidden" name="redirect_uri" value={ process.env.REDIRECT_URI } />
        <input type="hidden" name="state" value={ props.state } />
        <input type="hidden" name="scope" value="public_repo read:user" />
        <label htmlFor="target-repo">Enter the full URL of the GitHub repo you want to add a publiccode.yml file to</label>
        <aside>Enter the complete URL of the repo, starting with &ldquo;https://&rdquo;</aside>
        <input
            required
            id="target-repo"
            type="text"
            placeholder="https://github.com/repo-owner/repo-name"
            value={ props.targetRepo }
            onChange={ ev => props.handleTextInput(ev) }
        />
        <button className="editor_button editor_button--primary" >Login to GitHub</button>
    </form>
)

export default LoginForm
