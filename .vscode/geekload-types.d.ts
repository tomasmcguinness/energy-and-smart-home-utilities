declare class GroupClass {
  /**
   * Execute test group
   *
   * @param scenario Name or identifier of scenario function
   * @param users Amount of virtual users
   * @param profile Duration string ('5s', '1m 30s' etc) or Profile object
   */
  run(scenario: any, users: number, profile: any): void;
}

declare class ConfigClass {

}

/**
* Configuration of project
*/
declare const config: ConfigClass;

declare class StageClass {
  /**
   * Execute test stage
   *
   * @param title Title of stage 
   * @param users Amount of virtual users
   * @param groups Array of groups 
   */  
  run(title: string, users: number, groups: GroupClass[]): void;
}

/**
* Stage of test with set of Groups
*/
declare const Stage: StageClass;

/**
* Group of test with set of Scenarios
*/
declare const Group: GroupClass;

/**
* Class representing BaseHttpRequest.
*/
declare class BaseHttpRequest {
  /**
   * Create a http GET request.
   *
   * @param {string} path - Relative path to target point.
   * @returns {HttpRequest} - The created HttpRequest.
   */
  get(path: string): HttpRequest;

  /**
   * Create a http PUT request.
   *
   * @param {string} path - Relative path to target point.
   * @returns {HttpRequest} - The created HttpRequest.
   */
  put(path: string): HttpRequest;

  /**
   * Create a http POST request.
   *
   * @param {string} path - Relative path to target point.
   * @returns {HttpRequest} - The created HttpRequest.
   */
  post(path: string): HttpRequest;

  /**
   * Create a http PATH request.
   *
   * @param {string} path - Relative path to target point.
   * @returns {HttpRequest} - The created HttpRequest.
   */
  patch(path: string): HttpRequest;

  /**
   * Create a http DELETE request.
   *
   * @param {string} path - Relative path to target point.
   * @returns {HttpRequest} - The created HttpRequest.
   */
  delete(path: string): HttpRequest;

  /**
   * Create a http OPTIONS request.
   *
   * @param {string} path - Relative path to target point.
   * @returns {HttpRequest} - The created HttpRequest.
   */
  options(path: string): HttpRequest;

  /**
   * Create a http HEAD request.
   *
   * @param {string} path - Relative path to target point.
   * @returns {HttpRequest} - The created HttpRequest.
   */
  head(path: string): HttpRequest;
}

/**
 * Body of Request's response.
 */
declare class BodyClass {
  asText: string;
  asObject: object;
  asBytes: number[]
}

/**
 * Result of HttpRequest's execution.
 */
declare class HttpResult {
  statusCode: number
  body: BodyClass
}

/**
 * Class representing HttpRequest.
 */
declare class HttpRequest extends BaseHttpRequest {
  /**
   * Add header to request.
   *
   * @param {string} name - Name of the header.
   * @param {string} value - Value of the header.
   * @returns {HttpRequest} - The modified HttpRequest.
   */
  header(name: string, value: string): HttpRequest;

  /**
   * Add cookie to request.
   *
   * @param {string} name - Name of the cookie.
   * @param {string} value - Value of the cookie.
   * @returns {HttpRequest} - The modified HttpRequest.
   */
  cookie(name: string, value: string): HttpRequest;

  /**
   * Add query parameter to request url.
   *
   * @param {string} name - Name of the query parameter.
   * @param {string} value - Value of the query parameter.
   * @returns {HttpRequest} - The modified HttpRequest.
   */
  query(name: string, value: string): HttpRequest;

  /**
   * Set body value.
   *
   * @param {any} object - Body value.
   * @returns {HttpRequest} - The modified HttpRequest.
   */
  body(object: any): HttpRequest;

  /**
   * Execute request.
   *
   * @returns {HttpResult} - The HttpResult.
   */
  sync(): HttpResult;

  /**
   * Execute request checks.
   *
   * @param {CheckExpression} check - Check object.
   * @returns {HttpRequest} - The modified HttpRequest.
   */
  then(check: CheckExpression): HttpRequest;

  /**
   * Execute request checks.
   *
   * @param {() => any} check - Check function.
   * @returns {HttpRequest} - The modified HttpRequest.
   */
  then(check: () => any): HttpRequest;
}

/**
 * Class representing HttpConnection.
 */
declare class HttpConnection extends BaseHttpRequest {
  /**
   * Open connection to server.
   *
   * @returns {HttpConnection} - The HttpConnection.
   */
  connect(): HttpConnection;
}

/**
 * Create a HTTP connection.
 *
 * @param {string} url - Url of server.
 * @param {Options} options - Optional options object.
 * @returns {HttpConnection} - The HttpConnection.
 */
declare function http(url: string, options?: Options): HttpConnection;

/**
 * Class representing Http2Connection.
 */
declare class Http2Connection extends HttpConnection {
}

/**
 * Create a HTTP2 connection.
 *
 * @param {string} url - Url of server.
 * @param {Options} options - Optional options object.
 * @returns {Http2Connection} - The Http2Connection.
 */
declare function http2(url: string, options?: Options): Http2Connection;

/**
 * Class representing WebSocketConnection.
 */
declare class WebSocketConnection {
  /**
   * Send text message.
   *
   * @param {string} value - Text message.
   */
  sendText(value: string): void;

  /**
   * Send array message.
   *
   * @param {byte[]} value - Byte array.
   */
  sendArray(value: number[]): void;

  /**
   * Receive a text message.
   *
   * @returns {string} - The received text message.
   */
  receiveText(): string;

  /**
   * Receive a byte array.
   *
   * @returns {byte[]} - The received byte array.
   */
  receiveArray(): number[];
}

/**
 * Create a WebSocket connection.
 *
 * @param {string} url - Url of server.
 * @param {Options} options - Optional options object.
 * @returns {WebSocketConnection} - The WebSocketConnection.
 */
declare function websocket(url: string, options?: Options): WebSocketConnection;

/**
 * Create a Swagger connection.
 *
 * @param {string} url - Url to Swagger definition.
 * @param {Options} options - Optional options object.
 * @returns {SwaggerConnection} - The SwaggerConnection.
 */
declare function swagger(url: string, options?: Options): SwaggerConnection;

/**
 * Class representing SwaggerConnection.
 */
declare class SwaggerConnection {
  /**
   * Print loaded definition to console.
   */
  show(): void;
}

/**
 * Class representing Options.
 */
declare class Options {
  cacheConnections: true;
  connectionTimeout: '1m';
}

/**
 * Change global options.
 *
 * @param {Options} value - Options object.
 */
declare function setOptions(value: Options): void;

/**
 * Pause scenario execution.
 *
 * @param {string} minDuration - Minimum duration of pause ('5ms', '1s 150ms', etc).
 * @param {string} maxDuration - Maximum duration of pause ('5ms', '1s 150ms', etc).
 */
declare function pause(minDuration: string, maxDuration: string): void;

/**
 * Test log.
 */
declare const Log: LogClass;

/**
 * Class representing LogClass.
 */
declare class LogClass {
  /**
   * Post message to test log.
   *
   * @param {string} text - Text of the message.
   */
  message(text: string): void;

  /**
   * Post warning message to test log.
   *
   * @param {string} text - Text of the message.
   */
  warning(text: string): void;

  /**
   * Post error message to test log.
   *
   * @param {string} text - Text of the message.
   */
  error(text: string): void;
}

/**
 * Class representing CheckExpression.
 */
declare class CheckExpression {
  /**
   * Checking for equality of the current and reference values.
   *
   * @param {any} value - Reference value.
   * @returns {CheckExpression} - The CheckExpression.
   */
  equal(value: any): CheckExpression;

  /**
   * Checking that the current value is greater than the reference value.
   *
   * @param {any} value - Reference value.
   * @returns {CheckExpression} - The CheckExpression.
   */
  great(value: any): CheckExpression;

  /**
   * Checking that the current value is less than the reference value.
   *
   * @param {any} value - Reference value.
   * @returns {CheckExpression} - The CheckExpression.
   */
  less(value: any): CheckExpression;

  /**
   * Checking that the current value contains the reference value.
   *
   * @param {any} value - Reference value.
   * @returns {CheckExpression} - The CheckExpression.
   */
  contains(value: any): CheckExpression;

  /**
   * Checking that the reference value contains the current value.
   *
   * @param {any} value - Reference value.
   * @returns {CheckExpression} - The CheckExpression.
   */
  isContained(value: any): CheckExpression;

  /**
   * Checking that the reference value exists.
   *
   * @returns {CheckExpression} - The CheckExpression.
   */
  exists(): CheckExpression;

  /**
   * Inverts the result of the check.
   *
   * @returns {CheckExpression} - The CheckExpression.
   */
  not(): CheckExpression;

  /**
   * Setting a custom message to display a checking error.
   *
   * @param {string} text - Custom message text.
   * @returns {CheckExpression} - The CheckExpression.
   */
  message(text: string): CheckExpression;

  /**
   * Saves the received value in the "Session" object with the specified name.
   *
   * @param {string} name - Value name.
   * @returns {CheckExpression} - The CheckExpression.
   */
  store(name: string): CheckExpression;
}

/**
 * The source of the value of the response status code for its verification.
 *
 * @returns {CheckExpression} - The CheckExpression.
 */
declare function statusCode(): CheckExpression;

/**
 * Selector for checking values obtained by Regular expression from body.
 *
 * @param {string | RegExp} expression - Regular expression.
 * @param {number} group - Index of RegExp group. 0 by default.
 * @param {number} index - Index of occurrence of expression. 0 by default.
 * @returns {CheckExpression} - The CheckExpression.
 */
declare function regexp(expression: any, group: number, index: number): CheckExpression;

/**
 * Selector for checking values obtained by xPath expression from body.
 *
 * @param {string} expression - xPath expression.
 * @returns {CheckExpression} - The CheckExpression.
 */
declare function xPath(expression: string): CheckExpression;

/**
 * Source of text for checking it.
 *
 * @returns {CheckExpression} - The CheckExpression.
 */
declare function text(): CheckExpression;

/**
 * Selector for checking cookies value obtained by name.
 *
 * @param {string} name - Name of cookie.
 * @returns {CheckExpression} - The CheckExpression.
 */
declare function cookie(name: string): CheckExpression;

/**
 * Selector for checking headers value obtained by name.
 *
 * @param {string} name - Name of header.
 * @returns {CheckExpression} - The CheckExpression.
 */
declare function header(name: string): CheckExpression;
