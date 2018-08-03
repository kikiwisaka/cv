export const getCurrentHash = () => {
  var length = window
    .location
    .hash
    .split('/')
    .length;
  return window
    .location
    .hash
    .split('/')
    .slice(0, length)
    .join('/')
};

export const getUrlHashSplit = (index) => {
  var aryHash = window
    .location
    .hash
    .split('/');
  if (index)
    return aryHash[--index];
  return aryHash;
};
