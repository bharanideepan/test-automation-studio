/**
 * Method used to convert milliseconds to seconds
 *
 * @param durationInMs Duration in milliseconds
 * @param decimalDigits Number of digits needed after decimal
 */
export const convertMsToSec = (
  durationInMs: string,
  decimalDigits = 2
): string => {
  let result = "0";
  if (isNaN(parseInt(durationInMs))) {
    return result;
  }
  const durationInSec = parseInt(durationInMs) / 1000;
  const power = Math.pow(10, decimalDigits);
  result = (Math.round(durationInSec * power) / power).toFixed(decimalDigits);
  return result;
};

export const reorder = <T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
