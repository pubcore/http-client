import getToken from '../src/getCsrfToken'
import {equal} from 'assert'
global.document = {}

describe('Read Cross Side Request Forgery token from cookie', () => {
	it('reads from document.cookie, if exists', () => {
		global.document.cookie = 'Csrf-Token=Obq9dwS96vOjNnnWkgU8kFlrWGtscDZSeTNob1YrTFV5d1JDTUZGSHVCSHlvT3FzNW45ZkJuZnlGVk55L2Zvd2kyNlhyOFVPdWtaY2RWbE5YdStKeGFrWmNmOVNhUzBGWkhRSHFBPT0%3D'
		equal(getToken(), 'Obq9dwS96vOjNnnWkgU8kFlrWGtscDZSeTNob1YrTFV5d1JDTUZGSHVCSHlvT3FzNW45ZkJuZnlGVk55L2Zvd2kyNlhyOFVPdWtaY2RWbE5YdStKeGFrWmNmOVNhUzBGWkhRSHFBPT0=')
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