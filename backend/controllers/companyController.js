const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const companies = await Company.find(query).sort({ name: 1 });
    return res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    return res.json({ success: true, company });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
