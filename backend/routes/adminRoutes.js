const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getStudents,
  addCompany,
  updateCompany,
  deleteCompany,
  addCodingQuestion,
  deleteCodingQuestion,
  addAptitudeQuestion,
  deleteAptitudeQuestion,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/students', getStudents);

router.post('/companies', addCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

router.post('/questions', addCodingQuestion);
router.delete('/questions/:id', deleteCodingQuestion);

router.post('/aptitude', addAptitudeQuestion);
router.delete('/aptitude/:id', deleteAptitudeQuestion);

module.exports = router;
