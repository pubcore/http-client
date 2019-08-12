## http request promise (based on axios http client)

#### Install

	npm i --save @pubcore/http-client

#### Example

	import request from '@pubcore/http-client'

	//a get request
	request({uri:'https://example.com', query:{id: 42}}).then(
		result => {
			//do something with result ...
		},
		err => {
			//do someging with error ...
		}
	)

	//post some json, with basic auth
	request({uri:'https://example.com', method:'post', username:'foo', password:'...', data:{name:'T-Bone'}, query:{id:42}}).then(
		res => {
			//show feedback
		},
		err => {
			//do someging with error ...
		}
	)


#### Features (test descriptions)

	✓ defaults to method get and accept application/json
	✓ rejects to {code:"REQUEST_ERROR", ...}, e.g. on timeout
	✓ rejects 4xx or 5xx to {code:"HTTP_ERROR", ...} (this is expected, not an exception)
	✓ serializes query params in "qs" package default format
	✓ has "authorization" argument to forward authentication
	✓ exports function to create basic-auth value for "authorization" agrument
	✓ has usernaame, password arguments for basic authentication
	✓ has userAgent argument to define own one
	✓ has "data" argument, treated as json (default) for post and put
	✓ has "contentType" argument, if set to "urlEncoded" data is converted accordingly
	✓ supports optional headers

#### rejected error object

Example if request failed (no response exists)

	{
		code:'REQUEST_ERROR',
		details: {
			message: 'timeout',
			uri: 'https://example.com/foo?id=12',
			method: 'get'
		}
	}

Example if request succeeded, but there is a http error (response exists)

	{
		code:'HTTP_ERROR',
		details:{
			body:{status:{code:'ERROR'}},
			headers:{'content-type': 'application/json'},
			message:'Request failed with status code 500',
			status:500,
			method:'get',
			uri:'https://www.example.com/500'
		}
	}

#### If there is a response, the promise is resolved to following result object
Example for "json" response:

	{
		status: 200,
		headers: {'Content-Type': 'application/json' //,...}
		body: {foo: bar}
	}
