'use strict';

module.exports = function (Cashtransaction) {

  Cashtransaction.getShopBalance = async function (salesPersonId, shopId) {
    const cardTransactions = await Cashtransaction.app.models.cardTransaction.find(
      {where: {and: [{salesPersonId: {eq: salesPersonId}}, {shopId: {eq: shopId}}]}});
    const cashTransactions = await Cashtransaction.find(
      {where: {and: [{salesPersonId: {eq: salesPersonId}}, {shopId: {eq: shopId}}]}});
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
  Cashtransaction.remoteMethod('getShopBalance',
    {
      accepts:
        [
          {arg: 'salesPersonId', type: 'string'},
          {arg: 'shopId', type: 'string'}
        ],
      returns: {arg: 'balance', type: 'number'},
      http: {path: '/getShopBalance/:salesPersonId/:shopId', verb: 'post'},
      description: 'Fetches shop balance'
    })
};
