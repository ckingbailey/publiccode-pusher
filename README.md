# Purpose
The intention of this project is to provide project leaders who are not programmers a way to commit a civic tech schema file, such as civic.json or publiccode.yml, to their Github repos. The intended user is a project or product manager who has write access to repos of projects they manage but who does not feel comfortable pulling the project onto their local machine, creating a new .json file, committing it to a new branch, and then opening a pull request for their changes.

# Scope
The code shall run entirely in the browser, without the need for a backend. The scripts shall target Github, and no other git hosting site. There shall be a web form to serve as a demo of the product. The current plan is to deploy to Github pages.

# Goals
1. Code runs entirely in browser.
2. Web form and schema file shall be drop-in. We haven't settled on a schema yet so this will need to remain flexible.
3. Use Github OAuth flow to authenticate user. Commit schema file as authenticated user.