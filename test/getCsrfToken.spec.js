import getToken from '../src/getCsrfToken'
import {equal} from 'assert'
global.document = {}
var token = 'Obq9dwS96vOjNnnWkgU8kFlrWGtscDZSeTNob1YrTFV5d1JDTUZGSHVCSHlvT3FzNW45ZkJuZnlGVk55L2Zvd2kyNlhyOFVPdWtaY2RWbE5YdStKeGFrWmNmOVNhUzBGWkhRSHFBPT0='

describe('Read Cross Side Request Forgery token from cookie', () => {
	it('supports cookie prefix "__Host-"', () => {
		global.document.cookie = '__Host-Csrf-Token=Obq9dwS96vOjNnnWkgU8kFlrWGtscDZSeTNob1YrTFV5d1JDTUZGSHVCSHlvT3FzNW45ZkJuZnlGVk55L2Zvd2kyNlhyOFVPdWtaY2RWbE5YdStKeGFrWmNmOVNhUzBGWkhRSHFBPT0%3D'
		equal(getToken(), token)
	})

	it('reads from document.cookie, if exists', () => {
		global.document.cookie = '; Csrf-Token=Obq9dwS96vOjNnnWkgU8kFlrWGtscDZSeTNob1YrTFV5d1JDTUZGSHVCSHlvT3FzNW45ZkJuZnlGVk55L2Zvd2kyNlhyOFVPdWtaY2RWbE5YdStKeGFrWmNmOVNhUzBGWkhRSHFBPT0%3D'
		equal(getToken(), token)
	})
	it('returns null if key not found', () => {
		global.document.cookie = 'Csrfoken=Obq9dwS96vOjNnnWkgU8kFlrWGtscDZSeTNob1YrTFV5d1JDTUZGSHVCSHlvT3FzNW45ZkJuZnlGVk55L2Zvd2kyNlhyOFVPdWtaY2RWbE5YdStKeGFrWmNmOVNhUzBGWkhRSHFBPT0%3D'
		equal(getToken(), null)
	})
	it('returns falsy values', () => {
		global.document.cookie = undefined
		equal(getToken(), undefined)
	})
	it('returns falsy value', () => {
		global.document = undefined
		equal(getToken(), undefined)
	})
})