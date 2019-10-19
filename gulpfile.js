let replace = require('gulp-replace')
let { src, dest } = require('gulp')

exports.default = function replaceServerURL() {
    return src('client/GithubClient.js')
    .pipe(replace(/(?<=const TOKEN_SERVER = ).+/g, "'https://us-central1-github-commit-schema.cloudfunctions.net/token'"))
    .pipe(dest('build/'))
}