import Shift from "./model";

exports.create = (req, res, next) => {
  const newShift = new Shift(req.body);

  newShift.save((err) => {
    if (err) {
      return next(err);
    }

    res.send(req.body);
  });
}

exports.getAll = (req, res, next) => {
  Shift.find({}, (err, shifts) => {
    if (err) {
      return next(err);
    }
    res.json(shifts);
  });
}

exports.getById = (req, res, next) => {
  Shift.findById(req.params.id, (err, shift) => {
    if (err) {
      return next(err);
    }
    res.json(shift);
  });
}

exports.deleteById = (req, res, next) => {
  Shift.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(204);
  });
}
