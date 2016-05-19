/**
* For use with Going gas videos
* APIS
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/

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
    var sheet = ss.getSheetByName(param.sheet || '');
    if (!sheet) {
      result.error = "Sheet does not exist";
    }
  }
  
  // get the data
  if (!result.error) {
    var range = sheet.getDataRange();
    if (range.getNumRows()) {
      result.data = GoingGasLib.SheetUtils.objectifyRange (
        range , param.nocache ? null :CacheService.getScriptCache() 
      )
    }
  }
  
  return result;
}
