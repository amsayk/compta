import { graphql } from 'graphql';

export default class NetworkLayer {
  constructor({ schema, rootValue, onError }) {
    this._schema = schema;
    this._rootValue = rootValue;
    this._onError = onError;
  }

  sendMutation(mutationRequest) {
    if (mutationRequest.getFiles()) {
      throw new Error('uploading files not supported');
    }

    return this._executeRequest('mutation', mutationRequest);
  }

  sendQueries(queryRequests) {
    return Promise.all(queryRequests.map(queryRequest =>
      this._executeRequest('query', queryRequest)
    ));
  }

  async _executeRequest(requestType, request) {
    const { data, errors } = await graphql(
      this._schema,
      request.getQueryString(),
      this._rootValue,
      {},
      request.getVariables()
    );

    if (errors) {
      request.reject(new Error(
        `Failed to execute ${requestType} \`${request.getDebugName()}\` for ` +
        `the following reasons:\n\n${formatRequestErrors(request, errors)}`
      ));
      if (this._onError) {
        this._onError(errors, request);
      }
      return;
    }

    // Round-trip the response through JSON to mimic the behavior of a GraphQL
    // server. This also avoids issues where graphql-js uses null-prototype
    // objects where Relay expects POJSOs.
    const response = JSON.parse(JSON.stringify(data));

    request.resolve({ response });
  }

  supports() {
    return false;
  }
}

function formatRequestErrors(request, errors) {
  var CONTEXT_BEFORE = 20;
  var CONTEXT_LENGTH = 60;

  var queryLines = request.getQueryString().split('\n');
  return errors.map(({locations, message}, ii) => {
    var prefix = (ii + 1) + '. ';
    var indent = ' '.repeat(prefix.length);

    //custom errors thrown in graphql-server may not have locations
    var locationMessage = locations ?
      ('\n' + locations.map(({column, line}) => {
        var queryLine = queryLines[line - 1];
        var offset = Math.min(column - 1, CONTEXT_BEFORE);
        return [
          queryLine.substr(column - 1 - offset, CONTEXT_LENGTH),
          ' '.repeat(offset) + '^^^'
        ].map(messageLine => indent + messageLine).join('\n');
        }).join('\n')) :
      '';

      return prefix + message + locationMessage;

  }).join('\n');
}
