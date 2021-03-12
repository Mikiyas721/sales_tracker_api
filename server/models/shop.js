'use strict';

module.exports = function (Shop) {
  Shop.addSalespersonShop = async function (shopToSave, salespersonId) {
    const shopResult = await Shop.findOrCreate({where: {phoneNumber: {eq: `${shopToSave.phoneNumber}`}}}, shopToSave);
    await Shop.app.models.shopSales.create(
      {
        "salesPersonId": salespersonId,
        "shopId": shopResult.id
      });

    return shopResult["0"];
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
      {arg: 'salesPersonId', type: "string", required: true},
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
      ,root:true
    },
    http: {path: '/addSalespersonShop/:salesPersonId', verb: 'post'},
    description: 'Adds Shop to both shop and shop-sales databases'
  })
};
