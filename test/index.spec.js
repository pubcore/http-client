import {expect} from 'chai'
import nock from 'nock'
import client, {basicAuth} from '../src/index'

const body = {foo:'bar'},
	response = {
		body,
		status:200,
		headers:{'content-type':'application/json'}
	},
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
nock('http://www.example.com').get('/').reply(200)
nock(baseUri).post('/data', {foo:'bar'}).reply(200, {})
nock(baseUri, {
	reqheaders: {test: 'test'},
}).post('/data').reply(201)
nock(baseUri).put('/urlencoded', 'foo=bar').reply(200, {})
nock(baseUri, {reqheaders:{'X-Csrf-Token':'TokenTestValue'}}).post('/csrfToken').reply(200, {})

beforeEach(() => {
	global.document = {}
	global.document.cookie = 'Csrf-Token=TokenTestValue; SomeOther=XY=Z'
})

describe('http client (axios based)', () => {
	it('defaults to method get and accept application/json', () =>
		client({uri:baseUri + '/resource'}).then(
			res => expect(res).to.deep.equal(response)
		)
	)
	it('rejects to {code:"REQUEST_ERROR", ...}, e.g. on timeout', () =>
		client({uri:baseUri + '/timeout', timeout:1}).then(
			res => {throw Error(res)},
			rej => expect(rej).to.deep.equal({
				code:'REQUEST_ERROR',
				details:{
					message:'timeout',
					method:'get',
					uri:'https://www.example.com/timeout'
				}
			})
		)
	)
	it('rejects 4xx or 5xx to {code:"HTTP_ERROR", ...} (this is expected, not an exception)', () =>
		client({uri:baseUri + '/500'}).then(
			res => {throw Error(res)},
			rej => expect(rej).to.deep.equal({
				code:'HTTP_ERROR',
				details:{
					body:{status:{code:'ERROR'}},
					headers:{'content-type': 'application/json'},
					message:'Request failed with status code 500',
					status:500,
					method:'get',
					uri:'https://www.example.com/500'
				}
			})
		)
	)
	it('serializes query params in "qs" package default format', () =>
		client({
			uri:baseUri + '/query',
			query:{foo:'bar', nested:{obj:{name:'test'}}}
		}).then(
			res => expect(res.status).to.equal(200)
		)
	)
	it('has "authorization" argument to forward authentication', () =>
		client({uri:baseUri + '/ba', authorization:'Basic Sm9objpEb2U='}).then(
			({body}) => expect(body).to.deep.equal(body)
		)
	)
	it('exports function to create basic-auth value for "authorization" agrument', () =>
		expect(basicAuth({username:'foo', password:'bar'})).to.equal('Basic Zm9vOmJhcg==')
	)
	it('has usernaame, password arguments for basic authentication', ()=>
		client({uri:baseUri + '/login', username:'John', password:'Doe'}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
	it('has userAgent argument to define own one', () =>
		client({uri:baseUri + '/agent', userAgent:'my-test'}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
	it('has "data" argument, treated as json (default) for post and put', () =>
		client({uri:baseUri + '/data', method:'post', data:{foo:'bar'}}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
	it('test headers', () =>
		client({uri:baseUri + '/data', method:'post', data:{foo:'bar'},
			headers:{test:'test'}}).then(
			({status}) => expect(status).to.equal(201)
		)
	)
	it('has "contentType" argument, if set to "urlEncoded" data is converted accordingly', () =>
		client({uri:baseUri + '/urlencoded', method:'put', contentType:'urlEncoded', data:{foo:'bar'}}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
	it('"Csrf-Token" cookie is forwarded via HTTP header "X-Csrf-Token" for POST, PUT and DELETE requests', () =>
		client({uri:baseUri + '/csrfToken', method:'post'}).then(
			({status}) => expect(status).to.equal(200)
		)
	)
})
