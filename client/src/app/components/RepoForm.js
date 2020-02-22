import React from 'react'

const RepoForm = props => (
    <form>
        {/* TODO: Check 'unauthorized' here */}
        <label htmlFor="target-repo">Enter the full URL of the GitHub repo you want to add a publiccode.yml file to</label>
        <aside>Enter the complete URL of the repo, starting with &ldquo;https://&rdquo;</aside>
        <input
            id="target-repo"
            type="text"
            placeholder="https://github.com/repo-owner/repo-name"
            value={ props.targetRepo }
            onChange={ ev => props.handleTextInput(ev) }
        />
        <button
            type="submit"
            onSubmit={ ev => props.handleSubmit(ev) }
            className="editor_button editor_button--primary"
        >Connect Repo</button>
    </form>
)

export default RepoForm