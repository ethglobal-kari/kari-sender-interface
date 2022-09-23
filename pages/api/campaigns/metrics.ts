import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import nextConnect from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let firebaseApp: firebase.app.App;
if (firebase.apps.length === 0) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}

const db = firebaseApp.firestore();

const apiRoute = nextConnect();

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const sids = req.query.sids as string[];
  const results = await Promise.all(
    sids.map(async (sid) => {
      const readSnapshot = (await db.collection(sid).doc("read").get()).data();
      const impressionSnapshot = (await db.collection(sid).doc("see").get()).data();
      const linkClickSnapshot = (await db.collection(sid).doc("linkClick").get()).data();
      return {
        [sid]: {
          impressions: Object.keys(impressionSnapshot || {}).length,
          reads: Object.keys(readSnapshot || {}).length,
          clicks: Object.keys(linkClickSnapshot || {}).length,
        },
      };
    }),
  );
  res.json(results.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
};

apiRoute.get(handler);

export default apiRoute;
