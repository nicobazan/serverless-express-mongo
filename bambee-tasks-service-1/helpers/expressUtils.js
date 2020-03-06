const decode = require('jwt-decode');

function getTokenFromRequest(req){
    if(req.headers && req.headers.authorization)
        if(req.headers.authorization.startsWith('Bearer '))
            return req.headers.authorization.substring(6,req.headers.authorization.length);
}

function getSubjectFromToken(token){
    const decodedToken = decode(token);
    if(decodedToken.sub)
        return decodedToken.sub;
    else return undefined;
}


module.exports = {
    getSubjectFromToken,
    getTokenFromRequest
};