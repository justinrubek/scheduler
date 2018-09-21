const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

export default function dateValidator(val) {
  if (typeof val != "string")
    return false;

  const split = val.split("-");
  if (split.length != 3)
    return false;

  // Check if all digits are numbers
  for (let item of split) {
    if (isNaN(item))
      return false;
  }

  const [year, month, day] = split;

  if (year.length != 4)
    return false;

  // I do not believe the length checks are needed for day or month
  /*
  if (month.length != 2)
    return false;
  */

  if (month > 12 || month < 1)
    return false;

  /*
  if (day.length != 2)
    return false;
  */
  if (day > monthLength[month - 1] || day < 1)
    return false;

  return true;
  
};
