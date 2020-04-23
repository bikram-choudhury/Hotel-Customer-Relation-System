const express = require('express');
const router = express.Router();
const schema = require('../schemas/user.schema');
const AuthController = require('../controllers/auth.controller');

router.post('/signup', async (request, response) => {
    const dataToSave = request.body || {};
    if (Object.prototype.toString.call(dataToSave) === '[object Object]') {
        try {
            const user = new schema(dataToSave);
            const newUser = await user.save();

            const accessToken = AuthController.createToken(newUser.toObject());
            response.json({
                accessToken: accessToken,
                tokenType: AuthController.tokenType
            });

        } catch (error) {
            response.status(500).send(error);
        }
    }
});

router.post('/signin', async (request, response) => {
    const dataToValidate = request.body || {};
    if (Object.prototype.toString.call(dataToValidate) === '[object Object]') {
        try {
            const user = await schema.findOne({ username: dataToValidate.username, password: dataToValidate.password });
            if (user) {
                const accessToken = AuthController.createToken(user.toObject());
                response.jsonp({
                    accessToken: accessToken,
                    tokenType: AuthController.tokenType
                });
            } else {
                const message = 'Incorrect credentials';
                response.status(400).json({ message });
            }
        } catch (error) {
            response.status(500).send(error);
        }
    }
});

module.exports = router;