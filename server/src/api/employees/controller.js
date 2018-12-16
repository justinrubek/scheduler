import Employee from "./model";

exports.create = (req, res, next) => {
  const newEmployee = new Employee(req.body);

  newEmployee.save(err => {
    if (err) {
      return next(err);
    }

    res.send(req.body);
  });
};

exports.getAll = (req, res, next) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      return next(err);
    }
    res.json(employees);
  });
};

exports.getById = (req, res, next) => {
  Employee.findById(req.params.id, (err, employee) => {
    if (err) {
      return next(err);
    }
    res.json(employee);
  });
};

exports.deleteById = (req, res, next) => {
  Employee.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      return next(err);
    }
    res.sendStatus(204);
  });
};

const updateOpts = {
  runValidators: true
};

exports.updateById = (req, res, next) => {
  Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    updateOpts,
    (err, shift) => {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    }
  );
};
