'use strict';

var Hapi = require('hapi');
var config = require('./config');
var indexRoutes = require('./src/api/index/indexRoutes');
//mk:require

var options = {
	cors: true,
	cache: {
		engine: 'redis',
		partition: 'cm'
	}
};

var server = Hapi.createServer('0.0.0.0', config.port, options);
<% if (!!npmDependencies.flod) {%>
var Flod = require('flod');
var probe = new Flod.Probe(server, {server: 'hapi', version: '<%= npmDependencies.hapi%>'});
<%}%>

server.route(indexRoutes);
//mk:route

// Hook to provide index.html for any request
server.ext('onPreResponse', function (request, reply) {
	var response = request.response;
	if (!response.isBoom || response.output.statusCode !== 404) {
		return reply();
	}
	reply.file('../client/dist/index.html');
});

server.start();
console.log('Hapi server running in port ' + config.port);

module.exports = server;