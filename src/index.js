import axios from 'axios'
import get from 'lodash.get'
import qs from 'qs'
const CancelToken = axios.CancelToken,
	TIMEOUT = 30000,
	METHOD = 'get',
	CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded',
	URLENCODED = 'urlEncoded'

export const basicAuth = ({username, password}) =>
	'Basic ' + (new Buffer(`${username}:${password}`)).toString('base64')

axios.defaults.withCredentials = true

export default ({
	uri, method, query, data, authorization, userAgent, accept, timeout,
	username, password, contentType, httpsAgent, stringify
}) => {
	var headers = {Accept: accept || 'application/json'},
		cancelRequest = () => {},
		timeoutId = setTimeout(
			() => {
				cancelRequest('timeout')
				clearTimeout(timeoutId)
			},
			(timeout || TIMEOUT)
		),
		auth

	if(authorization !== undefined) headers.Authorization = authorization
	if(userAgent !== undefined) headers['User-Agent'] = userAgent
	if(username !== undefined || password !== undefined) auth = {username, password}

	return axios({
		url:uri,
		method:method || METHOD,
		params:query,
		data: [CONTENT_TYPE_FORM, URLENCODED].indexOf(contentType) >= 0
			&& ['post', 'put'].indexOf(method.toLowerCase()) >= 0 ?
			qs.stringify(data)
			:data,
		headers,
		paramsSerializer:stringify || (query => qs.stringify(query, {encodeValuesOnly:true})),
		cancelToken: new CancelToken(c => cancelRequest = c),
		auth,
		httpsAgent
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
						method: get(err, 'config.method') || method || METHOD
					}
				})
			}else{
				return Promise.reject({
					code:'REQUEST_ERROR',
					details: {
						message: err.message,
						uri: get(err, 'request._currentUrl') || uri,
						method: get(err, 'config.method') || method || METHOD
					}
				})
			}
		}
	)
}
