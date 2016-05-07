const settings = {
  number: {
    precision : 2,    // default precision on numbers is 0
  }
};

function checkPrecision(val, base) {
  val = Math.round(Math.abs(val));
  return isNaN(val)? base : val;
}

export function toFixed(value: number, precision) {
  precision = checkPrecision(precision, settings.number.precision);
  const power = Math.pow(10, precision);

  // Multiply up by precision, round accurately, then divide and use native toFixed():
  return (Math.round(value * power) / power).toFixed(precision);
};
