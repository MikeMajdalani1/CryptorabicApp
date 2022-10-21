export const checkFullNumber = (str) => {
  const onlyNumbs = /^\d+$/;

  if (str.charAt(0) === '+') {
    str = str.substring(1);
  }

  return !onlyNumbs.test(str.replace('-', ''));
};
