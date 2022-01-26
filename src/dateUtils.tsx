const getOrdinalNum = (n: number) => {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
};

export const getDateForPage = (d: Date, preferredDateFormat: string) => {
  const getYear = d.getFullYear();
  const getMonth = d.toString().substring(4, 7);
  const getMonthNumber = d.getMonth() + 1;
  const getDate = d.getDate();

  if (preferredDateFormat === 'MMM do yyyy') {
    return `[[${getMonth} ${getOrdinalNum(getDate)}, ${getYear}]]`;
  } else if (
    preferredDateFormat.includes('yyyy') &&
    preferredDateFormat.includes('MM') &&
    preferredDateFormat.includes('dd') &&
    ('-' || '_' || '/')
  ) {
    var mapObj = {
      yyyy: getYear,
      dd: ('0' + getDate).slice(-2),
      MM: ('0' + getMonthNumber).slice(-2),
    };
    let dateStr = preferredDateFormat;
    dateStr = dateStr.replace(/yyyy|dd|MM/gi, function (matched) {
      return mapObj[matched];
    });
    return `[[${dateStr}]]`;
  } else if (preferredDateFormat === 'MMMM do, yyyy') {
    return `[[${d.toLocaleString('default', { month: 'long' })} ${getOrdinalNum(
      getDate
    )}, ${getYear}]]`;
  } else {
    return `[[${getMonth} ${getOrdinalNum(getDate)}, ${getYear}]]`;
  }
};

export const getDayInText = (d: Date) => {
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return weekdays[d.getDay()];
};

export const getScheduledDeadlineDate = (d: Date) => {
  const getYear = d.getFullYear();
  const getMonthNumber = d.getMonth() + 1;
  const getDate = d.getDate();

  return `${getYear}-${getMonthNumber}-${getDate}`;
};
