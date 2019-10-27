let replace = require('gulp-replace')
let del = require('del')
let { src, dest, series } = require('gulp')

function clean() {
    del([ 'build/{,.}*[!.,!.git]' ])
}

function build() {
    return src('client/**/*')
    .pipe(dest('build/'))
}

function replaceVars() {
    return src('build/GithubClient.js')
    .pipe(replace(/(?<=const TOKEN_SERVER = ).+/g, "'https://us-central1-github-commit-schema.cloudfunctions.net/token'"))
    .pipe(dest('build/'))
}

exports.default = series(clean, build, replaceVars),
exports.clean = clean