## 2.5.0 2019-10-15
* add optional "headers" param to set arbitrary HTTP headers
* add optional "maxRedirect" param

## 2.3.0 2019-05-13
* url-encode only values, not keys of query params
* introduce optional "stringify" callback for query-param serialization
* enable forwarding basic-auth credentials (if exists) as default
* Browser only: Auto support reading of "Csrf-Token" Cookie (if exits) and addint it to
HTTP header "X-Csrf-Token" of POST, PUT and DELETE requests

## 2.0.0 2018-11-12
* resolved, if response having http status < 300, else rejected with info object

## 1.1.0 2018-11-09
* added "basicAuth" function export to create a authorization header value
