'use strict';

module.exports = function (SalesPerson) {
  const firebaseAdmin = require("firebase-admin");


  SalesPerson.createAccessToken = async function (salesPersonId) {
    const AccessTokenModel = SalesPerson.app.models.CustomAccessToken;
    return AccessTokenModel.create(
      {
        ttl: 1000 * 3600 * 24 * 365, userId: salesPersonId,
      }, {
        userId: salesPersonId,
      },
    );
  };

  SalesPerson.validateCredential = async function (credentials) {
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

  SalesPerson.verifyIdToken = async function (idToken) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const firebaseUser = await firebaseAdmin.auth().getUser(uid);
      return firebaseUser.phoneNumber;
    } catch (e) {
      console.log(e);
      /* const err = new Error('Invalid token');
       err.statusCode = 400;
       err.code = 'INVALID_TOKEN';
       throw err;*/
    }
  };

  SalesPerson.login = async function ({idToken}) {
    console.log(idToken);
    const phone = await SalesPerson.verifyIdToken(idToken);
    const salesPerson = await SalesPerson.findOne({
      phoneNumber: phone,
    })
    if (!salesPerson) {
      const err = new Error('Admin account not found');
      err.statusCode = 404;
      err.code = 'ADMIN_ACCOUNT_NOT_FOUND';
      throw err;
    }
    const accessToken = await SalesPerson.createAccessToken(salesPerson.id);
    return {
      token: accessToken.id,
      ...salesPerson.__data,
    };
  };

  SalesPerson.getBalance = async function (salesPersonId) {
    const cardTransactions = await SalesPerson.app.models.cardTransaction.find(
      {where: {salesPersonId: {eq: salesPersonId}}});
    const cashTransactions = await SalesPerson.app.models.cashTransaction.find(
      {where: {salesPersonId: {eq: salesPersonId}}});
    let totalCard = 0;
    cardTransactions.forEach((element) => {
      totalCard += element.amount;
    });
    let totalCash = 0;
    cashTransactions.forEach((element) => {
      totalCash += element.amount;
    });
    return totalCard - totalCash;
  }

  SalesPerson.getOwingSalespeople = async function () {
    const salesPeople = await SalesPerson.find();
    let owingPeople = [];

    for (let index in salesPeople) {
      let salespersonBalance = await SalesPerson.getBalance(salesPeople[index].id);
      if (salespersonBalance > 0) owingPeople.push({
        balance: salespersonBalance,
        ...salesPeople[index].__data
      })
    }
    return owingPeople;
  }

  SalesPerson.remoteMethod('getOwingSalespeople', {
    returns: {arg: 'salespeople', type: 'array'},
    description: 'Fetches owing salespeople'
  });

  SalesPerson.remoteMethod('getBalance',
    {
      accepts:
        [
          {arg: 'salesPersonId', type: 'string'},
        ],
      returns: {arg: 'balance', type: 'number'},
      http: {path: '/getBalance/:salesPersonId', verb: 'post'},
      description: 'Fetches salesperson balance'
    });

  SalesPerson
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
