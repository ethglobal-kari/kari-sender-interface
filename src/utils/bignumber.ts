import BigNumber from "bignumber.js";

export const bn = (n: BigNumber.Value) => new BigNumber(n);

BigNumber.prototype.fromDecimals = function (this: BigNumber, decimals: number): BigNumber {
  return this.div(`1e${decimals}`);
};

BigNumber.prototype.toDecimals = function (this: BigNumber, decimals: number): BigNumber {
  return this.times(`1e${decimals}`);
};

BigNumber.prototype.clamp = function (
  this: BigNumber,
  min: number | BigNumber,
  max: number | BigNumber,
): BigNumber {
  return BigNumber.max(BigNumber.min(this, max), min);
};

BigNumber.prototype.fromDenom = function (this: BigNumber): BigNumber {
  return this.div(`1e6`);
};

BigNumber.prototype.toDenom = function (this: BigNumber): BigNumber {
  return this.times(`1e6`);
};

BigNumber.prototype.toHexString = function (this: BigNumber, prefix = true): string {
  return (prefix ? "0x" : "") + this.toString(16);
};
