/* global require, console */
'use strict';

var https = require('https');
var path = require('path');
var proxyAgent = require('https-proxy-agent');
var querystring = require('querystring');
var url = require('url');


var name, version;
require('fs').readFile(path.join(__dirname, 'package.json'), function(err, data) {
	if (err) throw err;
	data = JSON.parse(data);
	name = data.name + '.js';
	version = data.version;
});


var ExchangeRates = function ExchangeRates(options) {
	options = options || {};
	this.api_key = options.api_key;
	this.proxy = options.proxy || process.env.http_proxy;
	if (!this.api_key) {
		throw 'No API key specified';
	}
};

ExchangeRates.prototype._makeProxy = function(url) {
	return new proxyAgent(url)
}

ExchangeRates.prototype._getResponse = function(endpoint, callback) {
	var options = {
		hostname: 'api-fxpractice.oanda.com', 
		headers: {
			Authorization: 'Bearer ' + this.api_key,
			'User-Agent': name + '/' + version
		},
		path: '/v1/' + endpoint
	};

	if (this.proxy) {
		options.agent = this._makeProxy(this.proxy);
	};

	https.get(options, function(httpRes) {
		var apiRes = {
			statusCode: httpRes.statusCode
		};
		var data = '';

		// buffer response data until it has arrived completely
		httpRes.on('data', function(chunk) {
			// chunk either a string or a Buffer
			if (Buffer.isBuffer(chunk)) {
				chunk = chunk.toString();
			}
			// now chunk always a string
			data += chunk;
		});

		// entire response data has arrived and ready to be parsed
		httpRes.on('end', function() {
			apiRes.raw = data;

			try {
				// console.log(data);
				apiRes.data = JSON.parse(data);
				apiRes.success = (httpRes.statusCode === 200);

				// as a convenience, set the code and message in the response wrapper level
				if (!apiRes.success) {
					apiRes.errorCode = apiRes.data.code;
					apiRes.errorMessage = apiRes.data.message;
				}
			} catch (e) {
				apiRes.errorMessage = 'Unable to parse JSON data: ' + e.message;
				apiRes.success = false;
			}

			if (callback != null) {
				callback(apiRes);
			}
		});

		httpRes.on('error', function(e) {
			if (callback != null) {
				callback({
					errorMessage: 'Problem with response: ' + e.message,
					success: false
				});
			}
		});
	});
};


ExchangeRates.prototype.getInstruments = function(options, callback) {

	var endpoint = 'instruments';
	var query = querystring.stringify(options);
	if (query) {
		endpoint += '?' + query;
	}

	this._getResponse(endpoint, function (res) {
		if (res.success) {
			console.log('instruments success');
			console.log(res.data);
		}
		else {
			console.log('instruments error');
		}

		if (callback !== null) {
			callback(res);
		}
	});
};

ExchangeRates.prototype.getPrices = function(options, callback) {

	var endpoint = 'prices';
	var query = querystring.stringify(options);
	if (query) {
		endpoint += '?' + query;
	}

	this._getResponse(endpoint, function (res) {
		if (res.success) {
			console.log('prices success');
			console.log(res.data);
		}
		else {
			console.log('prices error');
		}

		if (callback !== null) {
			callback(res);
		}
	});
};

ExchangeRates.prototype.getHistory = function(options, callback) {

	var endpoint = 'candles';
	var query = querystring.stringify(options);
	if (query) {
		endpoint += '?' + query;
	}

	this._getResponse(endpoint, function (res) {
		if (res.success) {
			console.log('history success');
			// console.log(res.data);
		}
		else {
			console.log('history error');
		}

		if (callback !== null) {
			callback(res, options);
		}
	});
};


module.exports = ExchangeRates;
