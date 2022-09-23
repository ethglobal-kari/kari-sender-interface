export const shortenAddress = (address: string, start = 6, end = start) => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};
