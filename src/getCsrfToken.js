export default () => document && document.cookie && (
	decodeURIComponent( document.cookie.replace(
		new RegExp(
			'(?:(?:^|.*;)\\s*'
					+ encodeURIComponent('Csrf-Token').replace(/[-.+*]/g, '\\$&')
					+ '\\s*\\=\\s*([^;]*).*$)|^.*$'
		),
		'$1'
	)) || null
)