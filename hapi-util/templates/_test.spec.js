'use strict';

var sinon = require('sinon');
var rewire = require('rewire');
var <%= tpl.routeName %> = rewire('../../../../src/api/<%= tpl.routePath %>');
var logger = require('../../../../src/api/util/logger');
var Q = require('q');

describe('<%= tpl.routeName %> controller', function () {

	describe('handler', function () {

		var logStub, responseStub, codeStub, requestMock, responseMock;

		beforeEach(function () {
			requestMock = {
				params: {}
			};
			logStub = sinon.stub(logger, 'log');

			codeStub = function () {};
			responseMock = function () {
				return {
					code: codeStub
				};
			};
			responseStub = sinon.spy(responseMock);
		});

		afterEach(function () {
			logStub.restore();
		});

		it('should call the logger', function () {
			<%= tpl.routeName %>.<%= tpl.routeName %>Handler(requestMock, responseMock);
			expect(logStub.called).toBe(true);
			expect(logStub.args[0][0]).toEqual('info');
			expect(logStub.args[0][2].tags).toEqual(['app_info']);
			expect(logStub.args[0][2].method).toEqual('<%= tpl.routeName %>');
		});

		it('should reply a success', function (done) {
			codeStub = function (code) {
				expect(responseStub.called).toBe(true);
				expect(responseStub.args[0][0]).toEqual({success: true});
				expect(code).toEqual(200);
				done();
			};
			<%= tpl.routeName %>.<%= tpl.routeName %>Handler(requestMock, responseStub);
		});

	});

});