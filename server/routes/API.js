const express = require('express');
const router = express.Router();
const categoryRoute = require('./category');
const itemRoute = require('./item');
const authRoute = require('./auth');
const cartRoute = require('./cart');

router.get('/', (request, reponse) => {
    reponse.send("success");
});
router.use('/categories', categoryRoute);
router.use('/items', itemRoute);
router.use('/auth', authRoute);
router.use('/cart', cartRoute);

module.exports = router;