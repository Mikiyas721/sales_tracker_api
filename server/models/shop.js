'use strict';

module.exports = function (Shop) {
  Shop.addSalespersonShop = async function (shopToSave, salespersonId) {
    const shopResult = await Shop.findOrCreate({where: {phoneNumber: {eq: `${shopToSave.phoneNumber}`}}}, shopToSave);
    await Shop.app.models.shopSales.create(
      {
        "salesPersonId": salespersonId,
        "shopId": shopResult.id
      });

    return shopResult['shop'];
  }
  Shop.remoteMethod('addSalespersonShop', {
    accepts: [
      {
        arg: 'shopToSave', type: {
          "name": "string",
          "address": "string",
          "phoneNumber": "string",
          "balance": "number",
          "createdAt": "date",
          "updatedAt": "date"
        }, http: {source: 'body'}
      },
      {arg: 'salespersonId', type: "string", http: {source: 'body'}}
    ],
    returns: {
      arg: 'shop', type: {
        "id": "string",
        "name": "string",
        "address": "string",
        "phoneNumber": "string",
        "balance": "number",
        "createdAt": "date",
        "updatedAt": "date"
      }
    },
    description: 'Adds Shop to both shop and shop-sales databases'
  })
};
