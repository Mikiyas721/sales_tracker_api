'use strict';

module.exports = function (Admin) {
  const firebaseAdmin = require("firebase-admin");


  Admin.createAccessToken = async function (adminId) {
    const AccessTokenModel = Admin.app.models.CustomAccessToken;
    return AccessTokenModel.create(
      {
        ttl: 1000 * 3600 * 24 * 365, userId: adminId,
      }, {
        userId: adminId,
      },
    );
  };

  Admin.validateCredential = async function (credentials) {
    if (!credentials.idToken) {
      const err = new Error('token is required');
      err.statusCode = 400;
      err.code = 'TOKEN_REQUIRED';
      throw err;
    }
    if (credentials.idToken && typeof credentials.idToken !== 'string') {
      const err = new Error('Invalid token');
      err.statusCode = 400;
      err.code = 'INVALID_TOKEN';
      throw err;
    }
  };

  Admin.putt=async function(){

  }

  Admin.verifyIdToken = async function (idToken) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const firebaseUser = await firebaseAdmin.auth().getUser(uid);
      return firebaseUser.phoneNumber;
    } catch (e) {
      const err = new Error('Invalid token');
      err.statusCode = 400;
      err.code = 'INVALID_TOKEN';
      throw err;
    }
  };

  Admin.login = async function ({idToken}) {
    const phone = await Admin.verifyIdToken(idToken);
    const admin = await Admin.findOne({
      phoneNumber: phone,
    })
    if (!admin) {
      const err = new Error('Admin account not found');
      err.statusCode = 404;
      err.code = 'ADMIN_ACCOUNT_NOT_FOUND';
      throw err;
    }
    const accessToken = await Admin.createAccessToken(admin.id);
    return {
      token: accessToken.id,
      admin: admin,
    };
  };

  Admin
    .remoteMethod('login', {
      accepts: [
        {
          arg: 'credentials',
          type: {
            idToken: "string"
          },
          required: true,
          http: {source: 'body'},
        },
      ],
      returns: {arg: 'account', type: 'object', root: true},
    });
};
