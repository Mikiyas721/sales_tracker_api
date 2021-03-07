
'use strict';

module.exports = function(server) {
  const admin = require("firebase-admin");
  const serviceAccount = require("../../keys/firebase_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
};
