function formatDate(date) {
  const month = date.getMonth() + 1;
  let dateString = date.getFullYear() + '-';

  if (month < 10) {
    dateString += '0' + month;
  } else {
    dateString += month;
  }

  dateString += '-';

  const day = date.getDate();
  if (day < 10) {
    dateString += '0' + day;
  } else {
    dateString += day;
  }

  return dateString;
}

module.exports = {
  formatDate
};
