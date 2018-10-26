/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    view: function(req, res) {
        File.find().exec(function(err, files){
            if(err){
                res.send(500, {error: 'DB error'});
            }
            if(files==undefined){
              res.send('no files found');
            }
            console.log(req.me);
            return res.view('pages/account/view-files', {result:files});
        })
    },
 
    search: function(req,res) {
      //Search for files by the MSN 
      
      var results = File.find({
        aircraft: req.param('aircraft').toUpperCase()}).exec(function(err,results){
         
        if (err) {return res.serverError(err)}
        
        //If successful show corresponding files in a table
        if(results[0] == undefined){
          return res.send('No data entered')
        }

        if(results !== undefined){
          return res.view('pages/account/view-results', {result: results, me: req.me})
        }   
      })
    },


    upload: function(req, res) {
      req.file('file').upload({
          //Change according to local dirname
          dirname: 'C:/Users/vmasiero/Documents/GitHub/TrackingTool/TrackingTool/.tmp/uploads'
        }, function(err, uploads) {

          if(uploads.length > 5) {
            return res.send('Maximum 5 files can be uploaded')
          }
          //Upload multiple files
          uploads.forEach(file => {  
            //Get doctype of uploaded file          
            var data = file.filename.slice(file.filename.length-9,file.filename.length-4)
            console.log(data) 
            //Set doctype depending on the number
            if(data.includes('1'))
              {data = 'TabulatedResults'}
            
            if(data.includes('2'))
              {data = 'Airline'}
            
            if(data.includes('3'))
              {data = 'Fleet'}
            
            if(data.includes('4'))
              {data = 'AircraftID'}
            
            if(data.includes('5'))
              {data = 'Parameters'}
            //Create each file with corresponding parameters
            File.create({
              path: file.fd,
              filename: file.filename,
              aircraft: file.filename.slice(0, file.filename.length-9),
              doc: data        
            }).exec(function(err, file) {              
              if (err) 
              { console.log('error in file')
                return res.serverError(err)
              }           
          }); 
        })          
          if (err) { 
            console.log('error uploading files')
            return res.serverError(err) }       
          //if (uploads.length === 0) { return res.badRequest('No file was uploaded') }

          // if it was successful redirect and display all uploaded files
            return res.redirect('/files');
      })
    },
  }