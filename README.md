# Purpose
The intention of this project is to provide Code for America brigade project leaders who are not programmers a way to commit a civic tech schema file, such as civic.json or publiccode.yml, to their Github repos. The intended user is a project or product manager who has write access to repos of projects they manage but who does not feel comfortable pulling the project onto their local machine, manually creating a new data file, committing it to a new branch, and then opening a pull request for their changes.

# Scope
As much as possible, the code should run entirely in the browser, without minimal need for a backend. The scripts shall target Github, and no other git hosting site. There shall be a web form to serve as a demo of the product. The current plan is to deploy to Github pages with a handler for the auth token on Google Cloud Functions.

# Goals
1. Code runs in browser with minimal need for backend.
2. Web form and schema file shall be drop-in. We haven't settled on a schema yet so this will need to remain flexible.
3. Use Github OAuth flow to authenticate user. Commit schema file as authenticated user.

# Development

# Deployment
## The frontend is deployed to GitHub pages
Run the build step
```bash
npm run build
```

This builds to the `build/` folder. You will then need to push the `build/` folder to the `gh-pages` branch
```bash
git worktree add -b build gh-pages
git add build
git push -u origin gh-pages
```

## The backend is deployed on Google Cloud Platform
You'll need to install and configure the Google Cloud SDK. Check it out and get all the [hottest tips here](https://cloud.google.com/sdk/docs/)

Once you've got the thing installed, to push the code to GCP do
```bash
gcloud functions deploy token --source='src/http/token'
```

But actually I have courteously aliased that command for you to
```bash
npm run deploy
```

Yer gonna have to set the environment variables GH_CLIENT_ID and GH_CLIENT_SECRET to make it work.