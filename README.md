nodejs-fxtrade-api
===================

A Node.js module for accessing OANDA's fxTrade REST API.


##  Introduction

I created this project because I wanted to query exchange rates direct from the server.  Although there was a lot of useful examples provided by the OANDA team, they all seemed to be jQuery and Ajax based.

Please note this project only provides support for querying exchange rates but does not provide a full API implementation.  It would be quite easy for you to extend this project to include Accounts, Orders, Trade and Positions management.


## Methods

All methods supported take two arguments, an options object and a response callback.  

The options object should contain any your query parameters you wish to send with the request, [see full API specification](http://developer.oanda.com/docs/v1/rates/) for details.

### getInstruments

Get a list of tradeable instruments (currency pairs, CFDs, and commodities) that are available for trading with the account specified.

[Read more](http://developer.oanda.com/docs/v1/rates/#get-an-instrument-list)

### getPrices

Fetch live prices for specified instruments that are available on the OANDA platform.

[Read more](http://developer.oanda.com/docs/v1/rates/#get-current-prices)

### getHistory

Get historical information on an instrument

[Read more](http://developer.oanda.com/docs/v1/rates/#retrieve-instrument-history)



## Acknowledgements

Original code adapted from nodejs-exchange-rates by Jerome Lecomte.  Rewritten to work with the [OANDA's fxTrade API](http://developer.oanda.com/) rather than [OANDA's Exchange Rates API](http://www.oanda.com/rates).