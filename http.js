var file = new (require('node-static')).Server('./');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);

console.log("Listen: ", 8080);
