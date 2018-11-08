## http request promise (based on axios http client)

#### Install

	npm i --save @pubcore/http-client

#### Example

	import request from '@pubcore/http-client'

	const gofer = {
		error(err){
			//create user feedback ...
		}
	}

	//a get request
	request({uri:'https://example.com', query:{id: 42}, gofer}).then(
		result => {
			//do something with result ...
		}
	)

	//post some json, with basic auth
	request({uri:'https://example.com', method:'post', username:'foo', password:'...', data:{name:'T-Bone'}, query:{id:42}, gofer}).then(
		res => {
			//show feedback
		}
	)


#### Features (test descriptions)
	✓ defaults to method get and accept application/json
    ✓ supports timeout setting
    ✓ serializes query params by "qs" package default format
    ✓ returns 4xx or 5xx as usual (this is expected, not an exception)
    ✓ throws TypeError, if no gofer is provided for error handling
    ✓ has "authorization" argument to forward authentication
    ✓ has usernaame, password arguments for basic authentication
    ✓ has userAgent argument to define own one
    ✓ has "data" argument, treated as json (default) for post and put
    ✓ has "contentType" argument, if set to "urlEncoded" data is converted accordingly

#### Error result object, passed to error gofer

The error gofer is only called on errors while initialize the request (e.g. timeout, ssl issues). It is NOT called, if there is a response of server (this is an expected behaviour, for all http status codes, no exception).

Example

	{
		code:'REQUEST_ERROR',
		details: {
			message: 'timeout',
			uri: 'https://example.com/foo?id=12',
			method: 'get'
		}
	}

#### If there is a response, the promise is resolved to following result object
Example for "json" response:

	{
		status: 200,
		headers: {'Content-Type': 'application/json' //,...}
		body: {foo: bar}
	}
