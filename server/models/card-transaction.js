'use strict';

module.exports = function (Cardtransaction) {

  Cardtransaction.addSalesTransaction = async function (card, cash) {
    const cardResult = await Cardtransaction.create(card);
    const cashResult = await Cardtransaction.app.models.cashTransaction.create(cash);
    return {
      "cardId": cardResult.id,
      "cashId": cashResult.id,
      "soldAmount": cardResult.amount,
      "receivedAmount": cashResult.amount,
      "salesPersonId": cardResult.salesPersonId,
      "shopId": cardResult.shopId,
      "createdAt": cashResult.createdAt,
      "updatedAt": cashResult.updatedAt
    }
  }

  Cardtransaction.remoteMethod('addSalesTransaction', {
    accepts: [{
      arg: 'cardTransaction',
      type: {
        "amount": "number",
        "salesPersonId": "string",
        "shopId": "string",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }, {
      arg: 'cashTransaction', type: {
        "amount": "number",
        "salesPersonId": "string",
        "shopId": "string",
        "createdAt": "date",
        "updatedAt": "date"
      }
    }], returns: {
      arg: 'sales', type: {
        "cardId": "string",
        "cashId": "string",
        "soldAmount": "number",
        "receivedAmount": "number",
        "salesPersonId": "string",
        "shopId": "string",
        "createdAt": "date",
        "updatedAt": "date"
      }
    },
    description: 'Adds Card Transactions and Cash Transactions'
  });
};
