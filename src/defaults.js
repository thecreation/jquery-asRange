export default {
  namespace: 'asRange',
  skin: null,
  max: 100,
  min: 0,
  value: null,
  step: 10,
  limit: true,
  range: false,
  direction: 'h', // 'v' or 'h'
  keyboard: true,
  replaceFirst: false, // false, 'inherit', {'inherit': 'default'}
  tip: true,
  scale: true,
  format(value) {
    return value;
  }
};
