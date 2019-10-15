import axios from 'axios'
import get from 'lodash.get'
import qs from 'qs'
import getCsrfToken from './getCsrfToken'

const CancelToken = axios.CancelToken,
	TIMEOUT = 30000,
	METHOD = 'get',
	CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded',
	URLENCODED = 'urlEncoded'

export const basicAuth = ({username, password}) =>
	'Basic ' + (Buffer.from(`${username}:${password}`)).toString('base64')

axios.defaults.withCredentials = true

export default ({
	uri, method, query, data, authorization, userAgent, accept, timeout,
	username, password, contentType, httpsAgent, stringify, headers, maxRedirects
}) => {
	var _headers = {...(headers || {}), Accept: accept || 'application/json'},
		cancelRequest = () => {},
		timeoutId = setTimeout(
			() => {
				cancelRequest('timeout')
				clearTimeout(timeoutId)
			},
			(timeout || TIMEOUT)
		),
		auth,
		csrfToken,
		verb = (method || METHOD).toLowerCase()

	if(authorization !== undefined) _headers.Authorization = authorization
	if(userAgent !== undefined) _headers['User-Agent'] = userAgent
	if(
		typeof document !== 'undefined'
		&& ['post', 'put', 'delete'].indexOf(verb) >= 0
	) {

		csrfToken = getCsrfToken()
		if(csrfToken) _headers['X-Csrf-Token'] = csrfToken
	}
	if(username !== undefined || password !== undefined) auth = {username, password}
	return axios({
		url:uri,
		method:verb,
		params:query,
		data: [CONTENT_TYPE_FORM, URLENCODED].indexOf(contentType) >= 0
			&& ['post', 'put'].indexOf(verb) >= 0 ?
			qs.stringify(data)
			:data,
		headers:_headers,
		paramsSerializer:stringify || (query => qs.stringify(query, {encodeValuesOnly:true})),
		cancelToken: new CancelToken(c => cancelRequest = c),
		auth,
		httpsAgent,
		maxRedirects
	}).then(
		({status, data, headers}) => {
			clearTimeout(timeoutId)
			return {status, body:data, headers}
		},
		err => {
			clearTimeout(timeoutId)
			if(err.response){
				var {status, data, headers} = err.response
				return Promise.reject({
					code:'HTTP_ERROR',
					details: {
						status,
						body:data,
						headers,
						message: err.message,
						uri: get(err, 'request._currentUrl') || uri,
						method: get(err, 'config.method') || verb
					}
				})
			}else{
				return Promise.reject({
					code:'REQUEST_ERROR',
					details: {
						message: err.message,
						uri: get(err, 'request._currentUrl') || uri,
						method: get(err, 'config.method') || verb
					}
				})
			}
		}
	)
}
