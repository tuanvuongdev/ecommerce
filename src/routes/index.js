'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'))
// router.get('', (req, res) => {
//     const strCompress = 'hello world';
//     return res.status(200).json({
//         message: "Hello world",
//         metadata: strCompress.repeat(10000)
//     })
// })

module.exports = router;