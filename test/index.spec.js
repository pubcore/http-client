import {expect} from 'chai'
import nock from 'nock'
import client, {basicAuth} from '../src/index'

const body = {foo:'bar'},
	response = {
		body,
		status:200,
		headers:{'content-type':'application/json'}
	},
	gofer = {error:err => expect(err).to.contain({code:'REQUEST_ERROR'})},
	baseUri = 'https://www.example.com'

nock(baseUri).get('/ba').basicAuth({user:'John', pass:'Doe'}).reply(200, body)
nock(baseUri).get('/login').basicAuth({user:'John', pass:'Doe'}).reply(200, body)
nock(baseUri).get('/resource').reply(200, body)
nock(baseUri, {reqheaders:{'User-Agent':'my-test'}}).get('/agent').reply(200, body)
nock(baseUri).get('/timeout').socketDelay(10).reply(200, body)
nock(baseUri).get('/query').query(
	{foo: 'bar', nested:{obj:{name:'test'}}}
).reply(200, body)
nock(baseUri).get('/500').reply(500, {status:{code:'ERROR'}})
nock(baseUri).post('/data', {foo:'bar'}).reply(200, {})
nock(baseUri).put('/urlencoded', 'foo=bar').reply(200, {})

describe('http client (axios based)', () => {
	it('defaults to method get and accept application/json', () =>
		client({uri:baseUri + '/resource', gofer}).then(
			res => expect(res).to.deep.equal(response)
		)
	)
	it('supports timeout setting', () =>
		client({uri:baseUri + '/timeout', gofer, timeout:1}).then(
			res => expect(res).to.be.undefined
		)
	)
	it('serializes query params in "qs" package default format', () =>
		client({
			uri:baseUri + '/query', gofer,
			query:{foo:'bar', nested:{obj:{name:'test'}}}
		}).then(
			res => expect(res.status).to.equal(200)
		)
	)
	it('returns 4xx or 5xx as usual (this is expected, not an exception)', () =>
		client({uri:baseUri + '/500', gofer}).then(
			({body}) => expect(body).to.deep.equal({status:{code:'ERROR'}})
		)
	)
	it('throws TypeError, if no gofer is provided for error handling', () =>
		expect( () => client({uri:baseUri + '/resource'}) ).to.throw(TypeError)
	)
	it('has "authorization" argument to forward authentication', () =>
		client({uri:baseUri + '/ba', gofer, authorization:'Basic Sm9objpEb2U='}).then(
			({body}) => expect(body).to.deep.equal(body)
		)
	)
	it('exports function to create basic-auth value for "authorization" agrument', () =>
		expect(basicAuth({username:'foo', password:'bar'})).to.equal('Basic Zm9vOmJhcg==')
	)
	it('has usernaame, password arguments for basic authentication', ()=>
		client({uri:baseUri + '/login', gofer, username:'John', password:'Doe'}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
	it('has userAgent argument to define own one', () =>
		client({uri:baseUri + '/agent', gofer, userAgent:'my-test'}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
	it('has "data" argument, treated as json (default) for post and put', () =>
		client({uri:baseUri + '/data', method:'post', gofer, data:{foo:'bar'}}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
	it('has "contentType" argument, if set to "urlEncoded" data is converted accordingly', () =>
		client({uri:baseUri + '/urlencoded', method:'put', contentType:'urlEncoded', gofer, data:{foo:'bar'}}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
})
