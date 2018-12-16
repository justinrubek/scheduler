import Shift from "./model";

exports.create = (req, res, next) => {
  const newShift = new Shift(req.body);

  newShift.save(err => {
    if (err) {
      return next(err);
    }

    res.send(req.body);
  });
};

exports.get = (req, res, next) => {
  if (req.query && req.query.scheduledWorker) {
    Shift.find({ scheduledWorker: req.query.scheduledWorker }, (err, shifts) => {
      if (err) {
        return next(err);
      }
      res.json(shifts);
    });
  }
  else {
    Shift.find({}, (err, shifts) => {
      if (err) {
        return next(err);
      }
      res.json(shifts);
    });
  }
}

exports.getAll = (req, res, next) => {
  Shift.find({}, (err, shifts) => {
    if (err) {
      return next(err);
    }
    res.json(shifts);
  });
};

exports.getByEmployeeId = (req, res, next) => {
  Shift.find({ scheduledWorker: req.body.employeeId }, (err, shifts) => {
    if (err) {
      return next(err);
    }
    res.json(shifts);
  });
};

exports.getById = (req, res, next) => {
  Shift.findById(req.params.id, (err, shift) => {
    if (err) {
      return next(err);
    }
    res.json(shift);
  });
};

exports.deleteById = (req, res, next) => {
  Shift.deleteOne({ _id: req.params.id }, err => {
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
  Shift.findByIdAndUpdate(req.params.id, req.body, updateOpts, (err, shift) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};
