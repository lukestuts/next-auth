"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = csrfTokenHandler;

var _crypto = require("crypto");

var cookie = _interopRequireWildcard(require("./cookie"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function csrfTokenHandler(req, res) {
  var {
    cookies,
    secret
  } = req.options;

  if (cookies.csrfToken.name in req.cookies) {
    var [_csrfToken, _csrfTokenHash] = req.cookies[cookies.csrfToken.name].split('|');
    var expectedCsrfTokenHash = (0, _crypto.createHash)('sha256').update("".concat(_csrfToken).concat(secret)).digest('hex');

    if (_csrfTokenHash === expectedCsrfTokenHash) {
      var csrfTokenVerified = req.method === 'POST' && _csrfToken === req.body.csrfToken;
      req.options.csrfToken = _csrfToken;
      req.options.csrfTokenVerified = csrfTokenVerified;
      return;
    }
  }

  var csrfToken = (0, _crypto.randomBytes)(32).toString('hex');
  var csrfTokenHash = (0, _crypto.createHash)('sha256').update("".concat(csrfToken).concat(secret)).digest('hex');
  var csrfTokenCookie = "".concat(csrfToken, "|").concat(csrfTokenHash);
  cookie.set(res, cookies.csrfToken.name, csrfTokenCookie, cookies.csrfToken.options);
  req.options.csrfToken = csrfToken;
}