process.env.NODE_ENV = 'test'

async = require 'async'
assert = require('assert')
should = require('should')
mongoose = require('mongoose')
express = require('express')
HTTP = require('http-status-codes')
request = require('supertest')

routes = require('../../../routes/index')
Divesite = require('../../../models/Divesite')
User = require('../../../models/User')
app = require('../../../app')
utils = require('../utils')

describe "GET /divesites", () ->

  before (done) ->
    async.parallel [
      (cb) -> Divesite.create {name: 'SITE_1', category: 'wreck', chart_depth: 10, loc: [1, 1]}, cb
      (cb) -> Divesite.create {name: 'SITE_2', category: 'wreck', chart_depth: 20, loc: [2, 2]}, cb
      (cb) -> Divesite.create {name: 'SITE_3', category: 'wreck', chart_depth: 30, loc: [3, 3]}, cb
    ], done

  after (done) -> utils.tearDown done

  it "returns HTTP 200 and a list of objects", (done) ->
    request app
      .get '/divesites'
      .expect HTTP.OK
      .expect 'Content-Type', /json/
      .end (err, res) ->
        res.body.should.be.an.Array # response type ok
        res.body.length.should.equal 3 # correct length
        res.body.forEach (o) -> # check each element
          o.should.be.an.Object 
          o.should.have.properties ['name', '_id', 'category', 'loc', 'chart_depth']
        done()

  describe "when sent a pair of bounds", ->
    it "returns HTTP 200", (done) ->
      request app
        .get '/divesites'
        .query({bounds: [0,0,1,1]})
        .expect HTTP.OK
        .end done
    it "returns JSON", (done) ->
      request app
        .get '/divesites'
        .query {bounds: [0,0,1,1]}
        .expect 'Content-Type', /json/
        .end done
    it "returns a list", (done) ->
      request app
        .get '/divesites'
        .query {bounds: [0, 0, 1, 1]}
        .end (err, res) ->
          res.body.should.be.an.Array
          done(err)
    it "returns HTTP 400 if you try to specify a bounding polygon of size 0", (done) ->
      request app
        .get '/divesites'
        .query {bounds: [0, 0, 0, 0]}
        .expect HTTP.BAD_REQUEST
        .end done
    it "returns an empty list if nothing fits in the bounds", (done) ->
      request app
        .get '/divesites'
        .query {bounds: [0,0,0.1,0.1]}
        .end (err, res) ->
          res.body.should.be.an.Array
          res.body.should.have.length 0
          done(err)
    it "returns a list of 3 matching sites", (done) ->
      request app
        .get '/divesites'
        .query {bounds: [-1, -1, 3.5, 3.5]}
        .end (err, res) ->
          res.body.should.have.length 3
          done err

describe 'GET /divesites/:id', () ->
  before (done) ->
    async.parallel [
      (cb) -> Divesite.create {name: 'SITE_1', category: 'wreck', chart_depth: 10, loc: [1, 1]}, cb
      (cb) -> Divesite.create {name: 'SITE_2', category: 'wreck', chart_depth: 20, loc: [2, 2]}, cb
      (cb) -> Divesite.create {name: 'SITE_3', category: 'wreck', chart_depth: 30, loc: [3, 3]}, cb
    ], done
    ###
  before (done) ->
    [1, 2, 3].forEach (i) -> Divesite.create {
      name: 'TEST_SITE_' + i
      category: 'wreck'
      chart_depth: 100
      loc: [i, i]
    }
    ###

  after (done) -> utils.tearDown done

  describe "with a valid site ID", () ->
    it "returns HTTP 200 and a JSON object", (done) ->
      async.waterfall [
        (cb) -> Divesite.findOne cb
        (site, cb) ->
          request app
            .get "/divesites/#{site._id}"
            .expect HTTP.OK
            .expect 'Content-Type', /json/
            .end cb
        (res, cb) ->
          res.body.should.be.an.Object
          res.body.should.have.properties ['name', '_id', 'loc', 'category', 'chart_depth']
          res.body.loc.should.be.an.Array
          res.body.loc.length.should.equal 2
          res.body.loc[0].should.be.a.Number
          res.body.loc[1].should.be.a.Number
          cb()
      ], done
  describe "with a valid site ID that matches nothing", () ->
    it "returns HTTP 404", (done) ->
      site = new Divesite
      async.waterfall [
        (cb) ->
          request app
            .get "/divesites/#{site._id}"
            .expect HTTP.NOT_FOUND
            .expect 'Content-Type', /json/
            .end cb
        (res, cb) ->
          res.body.should.be.empty
          cb()
      ], done
  describe "with an invalid site ID", () ->
    it "returns HTTP 404", (done) ->
      async.waterfall [
        (cb) ->
          request app
            .get "/divesites/invalid/"
            .expect HTTP.NOT_FOUND
            .expect 'Content-Type', /json/
            .end cb
        (res, cb) ->
          res.body.should.be.empty
          cb()
      ], done
