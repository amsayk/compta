

export const sortMostRecent = (fn) => {
  return (a, b) => {
    return fn(b) - fn(a);
  }
};

export const sortOldest = (fn) => {
  return (a, b) => {
    return fn(a) - fn(b);
  }
};
