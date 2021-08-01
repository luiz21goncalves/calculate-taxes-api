const convertToCents = (value: string): number => {
  if (typeof value === 'undefined') return 0;

  return Number(value) * 100;
};

const serializeNumbers = (value: string): number => {
  const cents = convertToCents(value);

  return Number(cents.toFixed(0));
};

export { serializeNumbers, convertToCents };
