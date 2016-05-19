var TEST_FOLDER = 'testFolder-goinggas-advancedservice';
var TEST_SHEET_NAME = 'testSheet-goinggas-advancedservice';
var TEST_FUSION_TABLE = 'testFusion-goinggas-advancedservice';

function cleanupAdvanced () {
  cleanupDrive();
}
function cleanupDrive () {
  
  // always use exponential backoff for all operations
  var backoff = GoingGasLib.Utils.expBackoff;
  
  // delete test folders
  var folders = backoff( function () {
    return DriveApp.getFoldersByName(TEST_FOLDER);
  });
  
  while (folders.hasNext()) {
    var next = folders.next();
    backoff (function () {
      return next.setTrashed(true)
    });
  }
}

function deleteTestFiles (name) {
  
  // always use exponential backoff for all operations
  var backoff = GoingGasLib.Utils.expBackoff;
    var files = backoff ( function() {
    return DriveApp.getFilesByName(name); 
  });
  
  while (files.hasNext()) {
    files.next().setTrashed(true);
  }
  
}

function getCarrierDataRange () {
  // open the carriers worksheet for some test data
  return SpreadsheetApp.openById(
    '1dtOVzG7Sa1rLxnrGejGl5sixPCpm4zLELOEudh5N4y4'
  )
  .getSheetByName('carriers')
  .getDataRange();
}

/**
* delete any test sheets
*/
function deleteTestSheets() {
  return deleteTestFiles (TEST_SHEET_NAME);
}
function deleteTestFusion() {
  return deleteTestFiles (TEST_FUSION_TABLE);
}

/**
 * create a test sheet
 * @param {[string]} names of the sheets to create
 * @return {Range} the range of a1 on the first testsheet
 */
function createTestRange (names) {
  if (!Array.isArray (names)) {
    names = [names];
  }
  // and write to a sheet
  var ss = SpreadsheetApp.create(TEST_SHEET_NAME);
  var range = ss.getActiveSheet()
    .setName(names[0])
    .getRange('a1');
  
  // add any additional sheets
  names.slice(1).forEach(function (d) {
    ss.insertSheet(d);
  });
  
  return range;
} 

/**
 * create a test sheet
 * @return {Range} the range of a1 on the testsheet
 */
function getTestRange (name) {
  
 // get the testsheet bi name
  var backoff = GoingGasLib.Utils.expBackoff;
  var id = backoff ( function () {
    return DriveApp.getFilesByName(TEST_SHEET_NAME).next();
  }).getId();
  
 // and write to a sheet
  return backoff ( function () {
    return SpreadsheetApp
    .openById(id)
    .getSheetByName(name)
    .getRange('a1');
  });
} 
 