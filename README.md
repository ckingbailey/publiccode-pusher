# Purpose
The intention of this project is to provide Code for America brigade members who are not programmers a convenient and easy way to commit a civic tech schema file to the Github repos of the projects they are involved in. The intended user is a project or product manager who has write access to repos of projects they manage but who does not feel comfortable pulling the project onto their local machine, manually creating a new data file, committing it to a new branch, and then opening a pull request for their changes.
We have settled on [publiccode.yml](https://docs.italia.it/italia/developers-italia/publiccodeyml-en/en/master/schema.core.html) for our schema format.

# Scope
As much as possible, the code should run entirely in the browser, with minimal need for a backend. The form targets Github, and no other Git hosting site. The plan for now is to deploy to Github pages with a handler for the auth token on Google Cloud Functions.

We have adopted and adapted the official [publiccode-editor](https://github.com/italia/publiccode-editor). It's a React + Redux app, which makes the development setup of this project rather more complex, but hopefully the switch will pay off in saving us work that has already been done by the creator's of publiccode-editor.

# Development
**NOTE:** to make sure the servers get the right config, environment variable NODE_ENV=development

First, install the dependencies
```bash
npm install
```

There's a development server to stand in for the Cloud Functions runtime. It's entire purpose in life is to receive the `code` that the frontend gets from GitHub and exchange it for an `access_token`. We need a server-side function because we must keep the GitHub `client_secret` private. The token server will look for a couple of environment variables
```
GH_CLIENT_ID
GH_CLIENT_SECRET
```
Reach out to someone else on the project for these, or set up your own for your own app.

To run the server locally with nodemon
```bash
npm start
```

The backend is served at localhost:5000

The above development server does not serve the frontend.

## The frontend is now a React app

I [appropriated it from Italia](https://github.com/italia/publiccode-editor), who maintain publiccode.yml

If you've worked with React before, you probably know the drill. Navigate into the client/ folder and do
```bash
npm i
```

Then to run the development server, do
```bash
npm start
```

The frontend app is served at localhost:3000.

# Testing

⚠️ I honestly don't know what the state of the tests is since I switched to the React app. I guess I should try running them.

The tests on the backend use [Mocha](https://mochajs.org/), [Sinon](https://sinonjs.org), [proxyquire](https://github.com/thlorenz/proxyquire) and [Chai](https://www.chaijs.com). I haven't run them since I switched the frontend, but they should all still work as not much changed on token server. I suppose I should try running them, too.

# Deployment
## The frontend is deployed to GitHub pages

⚠️ This probably changed a lot since I switched to a React app for the frontend. I've only begun to figure that out and update this README.

Run the build step
```bash
npm run build-prod
```

This builds to the `dist/` folder. You will then need to push the `dist/` folder to the `gh-pages` branch
```bash
git worktree add --detach build
npm run build-prod
cd dist
git checkout -b gh-pages
git add .
git commit -m '<message for build commit>'
git push -u origin gh-pages
```

## The backend is deployed on Google Cloud Platform
You'll need to install and configure the Google Cloud SDK. Check it out and get [all the hottest tips here](https://cloud.google.com/sdk/docs/)

Once you've got the thing installed, to push the code to GCP do
```bash
gcloud functions deploy token --source='src/http/token'
```

But actually I have courteously aliased that command for you to
```bash
npm run deploy
```

Yer gonna have to set the environment variables GH_CLIENT_ID and GH_CLIENT_SECRET on the GCP function to make it work.