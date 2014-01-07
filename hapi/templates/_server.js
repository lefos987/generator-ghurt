'use strict';

var Hapi = require('hapi'),
		config = require('./config'),
		indexRoutes = require('./src/api/index/indexRoutes');

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

server.addRoutes(indexRoutes);

server.start();
console.log('Hapi server running in port ' + config.port);

module.exports = server;