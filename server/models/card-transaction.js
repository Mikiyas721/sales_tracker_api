'use strict';

module.exports = function (Cardtransaction) {

  Cardtransaction.addSalesTransaction = async function ({card, cash}) {
    console.log(card);
    console.log(cash);
    const cardResult = await Cardtransaction.create(card);
    let cashResult;
    if (cash.amount !== 0)
      cashResult = await Cardtransaction.app.models.cashTransaction.create(cash);
    return {
      "cardId": cardResult.id,
      "cashId": cashResult === undefined ? null : cashResult.id,
      "soldAmount": cardResult.amount,
      "receivedAmount": cashResult === undefined ? 0 : cashResult.amount,
      "salesPersonId": cardResult.salesPersonId,
      "shopId": cardResult.shopId,
      "createdAt": cardResult.createdAt,
      "updatedAt": cardResult.updatedAt
    }
  }

  Cardtransaction.remoteMethod('addSalesTransaction', {
    accepts: [
      {
        arg: 'card',
        type: {
          "card": {
            "amount": "number",
            "salesPersonId": "string",
            "shopId": "string",
            "createdAt": "date",
            "updatedAt": "date"
          },
          "cash": {
            "amount": "number",
            "salesPersonId": "string",
            "shopId": "string",
            "createdAt": "date",
            "updatedAt": "date"
          }
        },
        http: {source: 'body'}
      },
    ],
    returns: {
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
