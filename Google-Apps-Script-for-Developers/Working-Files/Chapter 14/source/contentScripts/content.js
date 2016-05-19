/**
* For use with Going gas videos
* APIS
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/

/**
* deal with request for content
* @param {object} e the do get parameter
* @return {ContentService} the result
*/


function doGet (e) {
  
  // content service is a published app
  // this one expects these in e.parameter
  // @param {string} id the spreadsheet id
  // @param {string} sheet the sheet name
  // @param {number} [nocache=0] whether to use cache
  // @param {string} [callback] if provided will do a jsonp
  // @return {object} {error:text,parameters:e.parameter,data:[data]}
  var result = process ( 
    getTestParameters(e).parameter 
  );
  
  // now return content as JSON/JSONP
  var content = JSON.stringify (result);
  var jsonp = result.parameters.callback;
  
  // publish result
  return ContentService
    .createTextOutput(
      jsonp ? jsonp + "(" + content + ")" : content
    )
    .setMimeType(
      jsonp ? 
        ContentService.MimeType.JAVASCRIPT : 
        ContentService.MimeType.JSON
    ); 
}

/**
 * excute request for spreadsheet data
 * @param {object} params the parameters
 * @return {object} the result
 */
function process (param) {
  
  var result = {
    parameters:param,
    data:[]
  }
  
  // get ss
  var ss = SpreadsheetApp.openById(param.id);
  if (!ss) {
    result.error = "Spreadsheet can't be opened";
  }
  

  // get the sheet
  if (!result.error) {
    var sheet = ss.getSheetByName(param.sheet);
    if (!sheet) {
      result.error = "Sheet does not exist";
    }
  }
  
  // get the data
  if (!result.error) {
    var range = sheet.getDataRange();
    if (range.getNumRows()) {
      result.data = GoingGasLib.SheetUtils.objectifyRange (
        range , param.nocache ? 
          null :CacheService.getScriptCache() 
      )
    }
  }
  
  return result;
}
