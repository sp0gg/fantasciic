var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/imageSearch"] = requestHandlers.imageSearch;
handle["/asciify"] = requestHandlers.asciify;

server.start(router.route, handle);