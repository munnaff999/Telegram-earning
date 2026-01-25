import express from "express";
import admin from "firebase-admin";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "xdevilearningtelegram",
    clientEmail: "firebase-adminsdk-fbsvc@xdevilearningtelegram.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7uoqdXqh8KUUy\n0NPQQOSQNdOMrjj/UMZImOO+g+KS27Xcbyr8XqHmOf2RztsOFqoo42vQeMt636U9\nTLZwrs9sFipDKWG4cm7ESdlZYUwg/IPvmxtZLE+gbprNa9/VrvTgQ3KtpB1AjuRl\ni6a/4cj3GGFywX4aKSvkIGxLXygPqnmcEEcdo71ZwEAigkyRxD1rgJz2kSteMeew\n4vyA+AnK41R1jvt6JbbvjxoBClN1X+Qug+QsvTxoxPLW5yfDmy3uURGexc9/JAwQ\nz0/MzJzjoriVYPTm3I9MM/hGJ9WymfGTsnD4LY+UPORPDK8SLhAJ9d6unJC2p85P\nO2QOrXWbAgMBAAECggEAKma7WUkgkA64SP5+4QpPNb1an2tYh15kstAJnKXoPphu\njq/zSxZKxhfyDIVm19tJqruXRfqKpyGtjldt26y4P+cPu6S0pDcAishNVdFSox61\n5CAqAK2v/IIO5/gGEhsWxzKky9CGJOdBciglTTC/tgPlOsi2ZU1IUxn5q9p9z2+j\n/HDdLKrDmdP8wSTjkDRwWekmosk+IjaQXNyYx4ny7mzxv4hQvoih4R1yqUYJKbsk\nDRgCBwVX7xzbzwoFHNxJAl5IiAIC5cNd7NMBRIM0eqvgQ5/dKkm1hB3ci+OR742r\nCz8xQdnMVFAkzN8FHvR4gHZTpNZG+tmph1E7+EOE8QKBgQDs9bHSM8ygEhVTEQD/\nh+q715CpOBvBkuh9rdXB/w+7YmKO/kI/u/8GUc7/f0vNUqUbbjA+T9BwHoNocZo8\nN8phj8hVC16Dk5g4iIQzOu31eSLjhDzl3sR52pO+frcz8TgdxOItF+HAhKp3uRzk\nP6eJArjDfFx3zCMHZ05oLGM6cQKBgQDK0CefdQJatT5KPVOY0iCKtj/TTQJ3sxRy\n4p3kwD23DwPyOWkkq50bIvsJujlpBk0SitWPqBEkllZqkTJRl/vl7X42+MGnFSkZ\nHO5ecZuI3h1gY/Pn+nE9WogHLha2eNAp73GlxS12dbaIaX5Fqi0XIE0cP5gnoaNA\nc4ELdSL+ywKBgQCDKll9JqktLfVZ3r6zs9OumNt9oA5VL3G8J958HSjjK8msp3ea\negDnyZ8QdLFL/WRhc7QGuf2CIpHQ3ZlnneZL7OASm1F8+dU37fFnvkX8LEqwsAFZ\nqN8PKHvB5biZavwKFnKwTVjsTUNjNDeW7NlbEQOfShaRRZFaRsfzCCcBMQKBgAt9\niZEmLvD2rcXE/bR9yywwsSMGjOo9Mh5kKm/oWFbDugSCLivOsUL1U2W0sEX7/mfb\nh8fwzK/W+KRm/4PR6YqYTvtMUqRltYNfuT2OkDJL6zwnzYzKCppgQ66sdMr3w0ts\n7nJm3nGEr8fAuk+2GYHi6Zt9GuC77qTbJmeAxm/LAoGAfunjblst8RH7za7rL4fV\n+y2PDX4fH/dA8Z6QQyEcVs1IR0Y474NOW30O640vO6CmL2es9/7S8ZPTVWlwLrYt\n4F2d7B4lnRbnLcrRZtn48ct9FX1lAfS/pQnQoAF83sXq1Pu66awsC5RpqWQHg+BX\n6cpbPWJ+/gKJu0z6jIAeLtQ=\n-----END PRIVATE KEY-----\n",
  })
});

const db = admin.firestore();

/* CPA POSTBACK */
app.get("/postback", async (req, res) => {
  const { uid, amount, offer_id } = req.query;

  if (!uid || !amount) return res.send("missing");

  const userRef = db.collection("users").doc(uid);

  await userRef.update({
    balance: admin.firestore.FieldValue.increment(Number(amount))
  });

  await db.collection("wallet_history").add({
    uid,
    amount: Number(amount),
    offer_id,
    type: "CPA",
    time: Date.now()
  });

  res.send("ok");
});

app.listen(3000, () => console.log("Postback running"));
