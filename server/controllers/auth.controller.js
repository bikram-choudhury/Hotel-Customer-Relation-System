const jwt = require('jsonwebtoken');

const SECRET_KEY = 'I am a Bad boy';
const expiresIn = '1hr';
const tokenType = 'Bearer';

module.exports = {
    tokenType,
    createToken: (payload) => {
        return jwt.sign(payload, SECRET_KEY, { expiresIn });
    },
    verifyToken: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, SECRET_KEY, (error, decode) => decode ? resolve(decode) : reject(error));
        })
    }
};