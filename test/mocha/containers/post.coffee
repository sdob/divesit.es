async = require 'async'
expect = require('chai').expect
HTTP = require('http-status-codes')
request = require('supertest')
faker = require 'faker'

utils = require '../utils'
app = require('../../../server/server')
Divesite = app.models.Divesite
User = app.models.User
Image = app.models.Image

StorageService = require('loopback-component-storage').StorageService

describe "POST /api/containers", ->

  storageService = {}

  before (done) ->
    storageService = new StorageService {root: '/tmp/test-storage', provider: 'filesystem'}
    storageService.createContainer {name: 'c1'}, (err, res) ->
      container = res
      done err

  after (done) ->
    storageService.destroyContainer 'c1', (err, res) ->
      done err


  describe "without authentication", ->
    it "returns HTTP 401", (done) ->
      request app
        .post "/api/containers"
        .expect HTTP.UNAUTHORIZED, done

  describe "with authentication", ->
    before utils.createUser
    after (done) -> User.destroyAll done

    token = {}
    userId = {}

    beforeEach (done) ->
      User.login {email: "user@example.com", password: "pass"}, (err, res) ->
        token = res.id
        userId = res.userId
        done err

    it "returns HTTP 401", (done) ->
      request app
        .post "/api/containers"
        .set "Authorization", token
        .expect HTTP.UNAUTHORIZED, done
