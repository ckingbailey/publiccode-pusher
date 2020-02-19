import React, { Fragment } from 'react'

const LoginForm = props => {
    return (
        <Fragment>
            { props.unauthorized && <h3>Try another repository?</h3> }
            <label htmlFor="target-repo">Enter the full URL of the GitHub repo you want to add a publiccode.yml file to</label>
            <aside>Enter the complete URL of the repo, starting with &ldquo;https://&rdquo;</aside>
            <input
                id="target-repo"
                type="text"
                placeholder="https://github.com/repo-owner/repo-name"
                value={ props.targetRepo }
                onChange={ ev => props.handleTextInput(ev) }
            />
            <a
                href={ `https://github.com/login/oauth/authorize?${ props.qs }` }
                onClick={ () => sessionStorage.setItem('target_repo', props.targetRepo) }
                className="editor_button editor_button--primary"
            >{ props.unauthorized ? 'Connect repo' : 'Login to GitHub' }</a>
        </Fragment>
    )
}

export default LoginForm
