const http = require("http");
const crypto = require("crypto");
const url = require("url");

var ids = {};

const server = http.createServer(function (request, response) {
	// Получаем cookie
	var cookie;
	if (request.headers.cookie) {
		cookie = request.headers.cookie;
	} else {
		cookie = "";
	}

	// Получаем sessionId
	const match = cookie.match(/sessionId=(\w+)/)
	var sessionId;

	if (match) {
		sessionId = match[1]
	} else {
		sessionId = crypto.randomBytes(16).toString('hex');
		response.setHeader('Set-Cookie', "sessionId=" + sessionId)
	}

	// Получаем value
	const parsedValue = url.parse(request.url, true)
	const value = parseFloat(parsedValue.query.value)

	// Проверяем есть ли результат суммирования в хранилище для этого пользователя
	if (ids[sessionId]) {
		ids[sessionId] = ids[sessionId] + value;
	} else {
		ids[sessionId] = 0 + value;
	}
	console.log(ids);

	response.end(ids[sessionId] + "")
})

server.listen(3000, function() {
	console.log("Сервер запущен!");
});