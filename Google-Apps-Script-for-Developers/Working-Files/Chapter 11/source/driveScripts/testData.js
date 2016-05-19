var TEST_FOLDER = 'testFolder-goinggas-driveservice';

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
