exports.dashboard = async (req, res) => {
  try {
    let employeesCount = req.employees.length;
    res.status(200).json({ employeesCount });
  } catch (err) {
    res.status(500).json({ err });
  }
};
