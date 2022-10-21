import { formatRelative } from 'date-fns';

export const checkFullNumber = (str) => {
  const onlyNumbs = /^\d+$/;

  if (str.charAt(0) === '+') {
    str = str.substring(1);
  }

  return !onlyNumbs.test(str.replace('-', ''));
};

export const fetchCoins = async () => {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20'
  );
  const json = await res.json();

  return json;
};

export const formatDate = (date) => {
  let formattedDate = '';
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};
