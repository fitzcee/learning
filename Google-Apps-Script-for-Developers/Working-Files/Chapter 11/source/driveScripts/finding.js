/**
 * for use with Going Gas videos
 * Drive Service - Finding folders and files
 * note that this uses the GoingGasLib library
 * key: MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
 */
function finding () {

  // always use exponential backoff for all operations
  var backoff = GoingGasLib.Utils.expBackoff;
  
  // clean up from previous runs
  cleanupDrive();
  
  // create a new test folder
  var testRoot = backoff ( function () {
    return DriveApp.createFolder(TEST_FOLDER);
  });
  
  var BRANCHES = 3;
  var FILES = 3;
  
  // add another few more branches
  for (var i=0; i < BRANCHES; i++ ) {
    backoff (function () {
      return testRoot.createFolder ('branch'+i);
    });
  } 
  
  // get getting folder from a path
  // note that this will get the first matching folder name
  for (var i=0; i < BRANCHES ;i++ ) {
    Logger.log (
      GoingGasLib.DriveUtils.getFolderFromPath(
        TEST_FOLDER + '/branch'+i
      ).getName()
    );
  }
    // add a few files
  for (var i=0; i< BRANCHES ;i++ ) {
    var folder = GoingGasLib.DriveUtils.getFolderFromPath(
      TEST_FOLDER + '/branch'+i
    );
    for (var j=0; j<FILES; j++) {
      backoff ( function () {
        return folder.createFile (
          'file'+j,
          'some text for file-' + j + ' branch-' + i
        );
      });
    }
  }
  
  // get some files by name
  ['/branch2/file1','/branch1/file0'].map (function (d) {
    return GoingGasLib.DriveUtils.getFilesFromPath(
      TEST_FOLDER + d
    );
  })
  .forEach (function (d) {
    Logger.log (
      d.hasNext() ? d.next().getName() : 'no file');
  });
  
  // using search
  // detail from sdk docs
  // https://developers.google.com/drive/v3/web/search-parameters
  var folder = GoingGasLib.DriveUtils.getFolderFromPath(
      TEST_FOLDER + '/branch2'
  );
  
  // search on the name
  var files = folder.searchFiles ("title = 'file0'");
  Logger.log (files.next().getName());
  
    // search for text
  var files = folder.searchFiles (
    "fullText contains 'file-1'"
  );
  Logger.log (files.next().getName());
}