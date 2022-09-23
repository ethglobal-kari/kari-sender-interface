export enum Route {
  HOME = "/",
}

export const Routes: Record<"FOOTER_HIDDEN", (Route | RegExp | string)[]> = {
  FOOTER_HIDDEN: [/.*/], // [Hide All],
};
