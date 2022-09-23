import { isBrowser } from "./isBrowser";
import amplitude from "amplitude-js";

// prettier-ignore
export enum AmplitudeEventType {
  Example                 = '[Example] - Example',
}

export class AmplitudeUtil {
  static init() {
    if (isBrowser && process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      amplitude.getInstance().init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
    }
  }

  static logEvent(event: string, data?: any) {
    let n: number | undefined;
    if (isBrowser && process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      n = amplitude.getInstance().logEvent(event, data);

      if (process.env.NEXT_PUBLIC_AMPLITUDE_LOGGING === "true") {
        console.log(n, event, data);
      }
    }
  }

  static logEventWithTimestamp(event: string, data?: any, timestamp?: number) {
    let n: number | undefined;
    if (isBrowser && process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
      n = amplitude.getInstance().logEventWithTimestamp(event, data, timestamp);

      if (process.env.NEXT_PUBLIC_AMPLITUDE_LOGGING === "true") {
        console.log(n, event, data, timestamp);
      }
    }
  }
}
