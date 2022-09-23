import "bignumber.js";

declare module "bignumber.js" {
  interface BigNumber {
    fromDecimals(decimals: number): BigNumber;
    toDecimals(decimals: number): BigNumber;
    clamp(min: number | BigNumber, max: number | BigNumber): BigNumber;
    /**
     * @returns value divided by 10^6
     */
    fromDenom(): BigNumber;
    /**
     * @returns value times 10^6
     */
    toDenom(): BigNumber;
    /**
     * @returns hex string e.g. `bn(288).toHex()` // 0x120
     * @param prefix include ***0x*** prefix,  default `true`;
     */
    toHexString(prefix?: boolean): string;
  }
}
