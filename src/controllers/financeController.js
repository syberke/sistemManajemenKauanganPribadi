const Finance = require('../models/financeModel');

// ================= GET ALL =================
const getFinances = async (req, res) => {
  try {
    const finances = await Finance.find({ user: req.user.id });
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE =================
const createFinance = async (req, res) => {
  const { title, amount, type, category } = req.body;

  if (!title || !amount || !type || !category) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Tipe harus income atau expense' });
  }

  try {
    const finance = await Finance.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
    });

    res.status(201).json(finance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
const updateFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (!finance || finance.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const updated = await Finance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (!finance || finance.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    await finance.deleteOne();
    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SUMMARY =================
const getFinanceSummary = async (req, res) => {
  try {
    const finances = await Finance.find({ user: req.user.id });

    const totalIncome = finances
      .filter(f => f.type === 'income')
      .reduce((a, b) => a + b.amount, 0);

    const totalExpense = finances
      .filter(f => f.type === 'expense')
      .reduce((a, b) => a + b.amount, 0);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= FILTER =================
const filterFinance = async (req, res) => {
  try {
    let query = { user: req.user.id };

    if (req.query.type) query.type = req.query.type;

    const finances = await Finance.find(query).sort({ createdAt: -1 });
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CATEGORY STATS =================
const getCategoryStats = async (req, res) => {
  try {
    const finances = await Finance.find({ user: req.user.id });

    const stats = finances.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= MONTHLY STATS =================
const getMonthlyStats = async (req, res) => {
  try {
    const year = req.query.year;
    if (!year) {
      return res.status(400).json({ message: 'Year required' });
    }

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${Number(year) + 1}-01-01`);

    const finances = await Finance.find({
      user: req.user.id,
      createdAt: { $gte: start, $lt: end },
    });

    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REPORT =================
const getFinanceReportByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const finances = await Finance.find({
      user: req.user.id,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= EXPORT (WAJIB SATU KALI) =================
module.exports = {
  getFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceSummary,
  filterFinance,
  getCategoryStats,
  getMonthlyStats,
  getFinanceReportByPeriod,
};
