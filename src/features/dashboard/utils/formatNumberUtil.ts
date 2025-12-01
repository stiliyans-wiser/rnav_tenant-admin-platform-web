export const formatNumber = (number: number, roundToPrecision?: number) => {
  const options: Intl.NumberFormatOptions = {};
  
  if (roundToPrecision !== undefined) {
    options.minimumFractionDigits = roundToPrecision;
    options.maximumFractionDigits = roundToPrecision;
  }
  
  return new Intl.NumberFormat('en-US', options).format(number);
};
