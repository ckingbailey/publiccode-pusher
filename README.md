# Purpose
The intention of this project is to provide Code for America brigade project leaders who are not programmers a convenient and easy way to commit a civic tech schema file to the Github repos they oversee. The intended user is a project or product manager who has write access to repos of projects they manage but who does not feel comfortable pulling the project onto their local machine, manually creating a new data file, committing it to a new branch, and then opening a pull request for their changes.
We have settled on [publiccode.yml](https://docs.italia.it/italia/developers-italia/publiccodeyml-en/en/master/schema.core.html) for our schema format.

# Scope
As much as possible, the code should run entirely in the browser, with minimal need for a backend. The scripts shall target Github, and no other git hosting site. There shall be a web form to serve as a demo of the product. The plan for now is to deploy to Github pages with a handler for the auth token on Google Cloud Functions.

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

The above development server does not serve the frontend. You'll need a separate HTTP server for that. I use [serve](https://github.com/zeit/serve#readme), installed globally, but you can use whatever you like.
```bash
serve client
```

# Testing
Tests use [Mocha](https://mochajs.org/), [Sinon](https://sinonjs.org), [proxyquire](https://github.com/thlorenz/proxyquire) and [Chai](https://www.chaijs.com).

# Deployment
## The frontend is deployed to GitHub pages
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