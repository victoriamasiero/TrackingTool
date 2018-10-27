/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    view: function(req, res) {
      // New aircraft if the last created entry, if it exists, display it
      if (aircraft_data === {}){res.send("No data found")}
      else{
        var headers = Data.getHeader();
        return res.view("pages/table/available-data", { data: [aircraft_data], headers: headers })
      }
    },
 
    search: function(req,res) {
      //Search for files by the MSN 
      var results = File.find({
        aircraft: req.param('aircraft').toUpperCase()}).exec(function(err,results){
         
        if (err) {return res.serverError(err)}
        
        //If successful show corresponding files in a table
        if(results[0] == undefined) {
          return res.send('no data')
        }
        if(results !== undefined){
          return res.view('pages/account/view-results', {result: results, me:req.me})
        }   
      })
    },

    th_wrap: function(field){
      return "<th>"+field+"</th>\n"
    },

  upload: function (req, res) {
      var XLSX = require("js-xlsx")
      var config_data = require("./config.json")
      var idendification_data = require("./ident_config.json")
      console.log(idendification_data)
      var pdf_data = require("./pdf_config.json")
      var f = sails.helpers.baseName
      var keys = Object.keys(config_data)
      var pdf_keys = Object.keys(pdf_data)
    aircraft_data = {}
      req.file("file").upload({
      }, function (err, uploads) {
        if (uploads === undefined) {
          return res.send("Upload did not work")
        }
        if(uploads.length > 7){
          return res.send("Maximum 7 files can be uploaded")
        }
        // Filter PDF vs XLS* Files
        var pdf_files = uploads.filter(upload => upload.filename.split(".").pop() == "pdf")
        var xls_files =  uploads.filter(upload => upload.filename.split(".").pop().indexOf("xls") !== -1)
        // Handle Excel Files First
        xls_files.forEach(file => {
          for(var k=0; k<keys.length; k++){
            var key = keys[k]
            if(file.filename.indexOf(key) !== -1){
               // Try to open the file, if it fails then report to the server
               try{workbook = XLSX.readFile(file.fd);}
               catch(error){err=error}
               var sub_keys = Object.keys(config_data[key])
               for(var l = 0; l < sub_keys.length; l++){
                 sheet = sub_keys[l];
                 if(workbook.SheetNames.includes(sheet) !== -1){
                   console.log("A WorkSheet has been found!")
                   s = workbook.Sheets[sheet]
                   var info_key = Object.keys(config_data[key][sheet])
                   var info = config_data[key][sheet];
                   for(var m=0; m<info_key.length; m++){
                        var prop = info_key[m];
                        if(prop==="Results"){
                            console.log("Crawling the table")
                            // Getting the info for the table is really diffrenet from the other properties
                            aircraft_data[prop] = sails.helpers.tableCrawler(info[prop], s)
                        }
                        else
                        {
                            console.log("Crawling Data")
                            if(sheet === "identification")
                            {
                              console.log(idendification_data)
                              console.log(prop)
                              console.log(s[info[prop]].v)
                              aircraft_data[prop] = idendification_data[prop][s[info[prop]].v]
                            }
                            else
                            {
                              aircraft_data[prop] = s[info[prop]].v
                            }
                   }}}
                 }
               }
            }
        })
        console.log("Handling PDF Files")
        var prefix = aircraft_data["Aircraft"]+" MSN "+aircraft_data["MSN"]+" "
        pdf_files.forEach(file => {
            pdf_keys.forEach(k => {
              if (file.filename.indexOf(k) !== -1) {
                aircraft_data[pdf_data[k]] = sails.helpers.createPdfLink(file.fd, prefix+pdf_data[k].replace('_', ' '))
              }
            })
          }
        )
        console.log("A new entry is about to be added to the database")
        console.log("Finishing processing Files and redirection")
        console.log(err !== undefined && err!== null)
        console.log(err)
        if (err !== undefined && err !== null) { 
            console.log('error uploading files')
            return res.serverError(err) }       
        console.log("Redirection")
        // if it was successful redirect and display all uploaded files
        return res.redirect('/files');
      }
      )

    },
  }
