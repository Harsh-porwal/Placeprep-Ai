const express = require('express');
const router = express.Router();
const { getAptitudeQuestions } = require('../controllers/aptitudeController');

router.get('/questions', getAptitudeQuestions);

module.exports = router;
