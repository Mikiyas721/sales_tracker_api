module.exports = function (server) {
  server.models.admin.findOrCreate({
    where: {
      phoneNumber: {
        eq: '+251941135730'
      }
    }
  }, {
    "name": "Mikiyas Tesfaye",
    "phoneNumber": "+251941135730",
    "roleId": "string"
  })
};
