export const truncateString = (str: string, head = 6, tail = head - 2) => {
  return str.substring(0, head) + "..." + str.substring(str.length - tail);
};
