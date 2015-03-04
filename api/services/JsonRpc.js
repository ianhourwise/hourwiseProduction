//JSONrpc Client 

scopedClient = require('scoped-http-client');

 // http://jsonrpc.org/spec.html
var JsonrpcClient;

JsonrpcClient = (function() {
  JsonrpcClient.errorCodes = {
    '-32700': 'JSON-RPC server reported a parse error in JSON request',
    '-32600': 'JSON-RPC server reported an invalid request',
    '-32601': 'Method not found',
    '-32602': 'Invalid parameters',
    '-32603': 'Internal error'
  };

  function JsonrpcClient(endpoint, username, api_key) {
    if (username && api_key){
        var auth_set = username + ':' + api_key;
        var base_64 = new Buffer(auth_set).toString('base64');
        var authstring = ' Basic ' + base_64;   

        this.client = scopedClient.create(endpoint).header('Content-Type',
         'application/json').header('Accept', 'application/json').header('Authorization',authstring);
    }
    else{
        this.client = scopedClient.create(endpoint).header('Content-Type',
         'application/json').header('Accept', 'application/json');
    }

    
  }

  JsonrpcClient.prototype.call = function(method, params, callback) {
    var jsonParams, requestString;
    jsonParams = {
      id: (new Date).getTime(),
      method: method,
      params: params
    };
    requestString = JSON.stringify(jsonParams);

    return this.client.scope('').post(requestString)(function(error, response, body) {
      var decodeError, decodedResponse, errorMessage, _base, _name;

      if (error) {
        callback(error, body);
        return;
      }
      try {
        decodedResponse = JSON.parse(body);
      } catch (_error) {
        decodeError = _error;
        console.log(body)
        callback('Could not decode JSON response', body);
        return;
      }
      if (decodedResponse.error) {
        errorMessage = (_base = JsonrpcClient.errorCodes)[_name = decodedResponse.error.code] || (_base[_name] = "Unknown error");
        errorMessage += " " + decodedResponse.error.message;
        callback(errorMessage, decodedResponse.error.data);
        return;
      }
      return callback(null, decodedResponse.result);
    });
  };

  return JsonrpcClient;
  console.log(JsonrpcClient);
})();

exports.create = function(endpoint, username, api_key) {
  return new JsonrpcClient(endpoint, username, api_key);
};