export default function timeValidator(val) {
  if (typeof val != "string")
    return false;

  const split = val.split(":");

  if (split.length != 2)
    return false;

  const [hours, minutes] = split;

  if (hours > 24 || hours < 0)
    return false;

  if (minutes >= 60 || minutes < 0)
    return false;

  return true;
};
