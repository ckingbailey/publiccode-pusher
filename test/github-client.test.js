let GhClient = require('../src/http/token/github-client')
let chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
let proxyquire = require('proxyquire')
let sinon = require('sinon')

chai.use(chaiAsPromised)
let { expect } = chai

describe('server-side GithubClient', function() {

    describe('constuctor', function() {
        it('throws when not passed a client_id', function() {
            expect(() => new GhClient(null, 3)).to.throw()
        })
        it('throws when not passed a client_secret', function() {
            expect(() => new GhClient(3, null)).to.throw(Error, 'client_secret is undefined')
        })
        it('throw when passed neither a client_id nor a client_secret', function() {
            expect(() => new GhClient()).to.throw(Error, 'client_id is undefined')
        })
        it('returns a GithubClient object with a getToken method when passed client_id and client_secret', function() {
            expect(new GhClient(3, 3).getToken).to.be.a('function')
        })
    })

    describe('getToken', function() {
        it('throws when not passed a `code`', async function() {
            let gh = new GhClient(3, 3)
            return expect(gh.getToken()).to.be.rejectedWith('code is undefined')
        })
        
        it('calls rp once and returns the response', async function() {
            let rpStub = sinon.stub().callsFake(function({ uri, method, headers, body, json }) {
                return new Promise((resolve, reject) => {
                    resolve({ access_token: 12345 })
                    reject({ error: 'oops' })
                })
            })
            let GhClient = proxyquire('../src/http/token/github-client',
                { 'request-promise': rpStub })
            let gh = new GhClient(3, 3)
            
            let token = await gh.getToken(555)

            expect(rpStub.callCount).to.equal(1)
            expect(token['access_token']).to.equal(12345)
        })
    })
})