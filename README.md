# Purpose
The intention of this project is to provide Code for America brigade project leaders who are not programmers a convenient and easy way to commit a civic tech schema file to the Github repos they oversee. The intended user is a project or product manager who has write access to repos of projects they manage but who does not feel comfortable pulling the project onto their local machine, manually creating a new data file, committing it to a new branch, and then opening a pull request for their changes.
We have settled on [publiccode.yml](https://docs.italia.it/italia/developers-italia/publiccodeyml-en/en/master/schema.core.html) for our schema format.

# Scope
As much as possible, the code should run entirely in the browser, with minimal need for a backend. The form targets Github, and no other Git hosting site. The plan for now is to deploy to Github pages with a handler for the auth token on Google Cloud Functions.

# Goals
1. Code runs in browser with minimal need for backend.
2. Use Github OAuth flow to authenticate user. Commit schema file as authenticated user.

# Development
First, install the dependencies
```bash
npm install
```

There's a development server to stand in for the Cloud Functions runtime. It's entire purpose in life is to receive the `code` that the frontend gets from GitHub and exchange it for an `access_token`. We need a server-side function because we must keep the GitHub `client_secret` private. To run the server locally with nodemon
```bash
npm start
```

The above development server does not serve the frontend.

## The frontend is now a React app

I [appropriated it from the Italians](https://github.com/italia/publiccode-editor), who invented publiccode.yml

If you've worked with React before, you probably know the drill. Navigate into the client/ folder and do
```bash
npm i
```

Then to run the development server, do
```bash
npm run dev
```

The app is served at localhost:3000.

# Testing

⚠️ I honestly don't know what the state of the tests is since I switched a React app. I guess I should try running them.

Tests use [Mocha](https://mochajs.org/), [Sinon](https://sinonjs.org), [proxyquire](https://github.com/thlorenz/proxyquire) and [Chai](https://www.chaijs.com).

# Deployment
## The frontend is deployed to GitHub pages

⚠️ This probably changed a lot since I switched to a React app for the frontend. I still gotta figure out what the new deploy flow is.

Run the build step
```bash
npm run build
```

This builds to the `build/` folder. You will then need to push the `build/` folder to the `gh-pages` branch
```bash
git worktree add --detach build
npm run build
cd build
git checkout -b gh-pages
git add .
git commit -m 'message for build commit'
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

Yer gonna have to set the environment variables GH_CLIENT_ID and GH_CLIENT_SECRET to make it work.