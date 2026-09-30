const DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function toAr(value) {
  return String(value).replace(/\d/g, (digit) => DIGITS[digit]);
}

const MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export function arabicDate(date = new Date()) {
  return `${toAr(date.getDate())} ${MONTHS[date.getMonth()]} ${toAr(date.getFullYear())}`;
}
