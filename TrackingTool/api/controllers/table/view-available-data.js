module.exports = {


  friendlyName: 'Table display',


  description: 'Display the table, finally',

  exits: {

    success: {
      viewTemplatePath: 'pages/table/available-data',
      description: 'Display the table'
    },

  },

  fn: async function (inputs, exits) {
     var data = await Data.find();
     var headers = Data.getHeader()
     var visible_headers = Data.getVisibleFields()
    return exits.success({data:data, headers:headers, search:false, visible_headers: visible_headers});
  }

};