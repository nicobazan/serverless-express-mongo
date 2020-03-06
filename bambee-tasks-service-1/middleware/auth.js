const jwksUri = process.env.JWKS_URI;
const domain = process.env.AUTH_DOMAIN;
const identifier = process.env.API_IDENTIFIER;
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri
    }),

    // Validate the audience and the issuer.
    audience: identifier,
    issuer: domain,
    algorithms: ['RS256']
});

module.exports = {
  checkJwt
};