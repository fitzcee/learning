/*
* this runs on server under control of client
* it should only contain Apps Script
*/ 

var Server = (function(server) {
  'use strict;'
  
  server.getData = function (checksum) {
    
    // get data from activesheet
    var range = SpreadsheetApp.getActiveSheet().getDataRange();
   
    // calculate the data checksum
    var package = {
      data:GoingGasLib.SheetUtils.objectifyRange (range),
      range:range.getA1Notation(),
      name:range.getSheet().getName()
    }
    
    // calculate the checksum
    var newChecksum = GoingGasLib.Utils.checksum (package);
    var activeRange = range.getSheet().getActiveRange();
    
    // return the data , null if the same as before
    return {
      package: checksum  === newChecksum ? null : package,
      position: {
        range:activeRange.getA1Notation(),
        row:activeRange.getRow(),
        column:activeRange.getColumn()
      },
      checksum:newChecksum
    }
  };
  
  return server;
})(Server || {});

// need to expose globally any functions to be called from the client;
function  stubGetData (arg) {
  return Server.getData(arg);
}
