export default () => document && document.cookie && (
	decodeURIComponent((document.cookie.match(
		new RegExp(';?\\s*(__Host\\-)?Csrf\\-Token\\s*\\=\\s*([^;]*)')
	)||[])[2]||'')
) || null