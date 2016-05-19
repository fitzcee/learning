/**
 * for use with Going Gas videos
 * Drive Service - Major classes
 * note that this uses the GoingGasLib library
 * key: MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
 */
function classes() {
  
  // always use exponential backoff for all operations
  var backoff = GoingGasLib.Utils.expBackoff;

  // clean up from previous runs
  cleanupDrive();
  
  // create a folder
  var folder = backoff ( function () {
    return DriveApp.createFolder(TEST_FOLDER);
  });
  
  // show its name/id
  Logger.log (folder.getName() + ':' + folder.getId());
  
  // open a folder by its name, returns an interator;
  var folderIterator = backoff (function () {
    return DriveApp.getFoldersByName(folder.getName())
  });
  
  // multiple folders can have the same name
  while (folderIterator.hasNext()) {
    Logger.log (folderIterator.next().getId());
  }
  
  // open by its id - one only
  var newFolder = backoff (function () {
    return DriveApp.getFolderById(folder.getId());
  });
  Logger.log (newFolder.getName() + ':' + newFolder.getId());
  
  // create a text file
  // Mime types...
  // http://www.iana.org/assignments/media-types/media-types.xhtml
  var file = backoff (function () {
    return newFolder.createFile(
      'sometext', 'some content', 'text/plain'
    );
  });
  Logger.log (file.getName() + ':' + file.getId());
  
  // open a file by its name
  // open a file by its name, returns an interator;
  var fileIterator = backoff (function () {
    return DriveApp.getFilesByName(file.getName());
  });
  
  // multiple files can have the same name
  while (fileIterator.hasNext()) {
    Logger.log (fileIterator.next().getId());
  }
  
  // open by its id - one only
  var newFile = backoff (function () {
    return DriveApp.getFileById(file.getId());
  });
  Logger.log (newFile.getName() + ':' + newFile.getId());
  
  // set sharing & permissions
  newFolder.setSharing(
    DriveApp.Access.DOMAIN_WITH_LINK, 
    DriveApp.Permission.EDIT
  );
  
  // add someone else
  newFolder.addEditors(['bruce.mcpherson@gmail.com']);
  
  // show who can edit
  var audience = newFolder
  .getEditors()
  .concat([newFolder.getOwner()]);
  
    // show it
  audience.forEach(function(d) {
    Logger.log( 
      d.getDomain()+ ':' + 
      d.getEmail() + ':' + 
      d.getName() + ':' + 
      d.getPhotoUrl()
    );
  });
  
  // create files with their picture
  audience.forEach (function (d) {
    if (d.getPhotoUrl()) {
      
      // get the image as a blob
      var blob = GoingGasLib.DocUtils.getImageFromUrl (
        d.getPhotoUrl()
      ).setName ('photo'+d.getEmail());

      
      // write it to a drive file
      backoff(function () {
         return DriveApp.createFile(blob);
      });
    }
  });
  
   // create some more files
  for (var i = 0 ; i < 20 ; i++) {
    backoff (function ()  {
      return newFolder.createFile(
        'fileNumber-'+i, 'content '+i
      );
    });
  }
  
  // get the folder contents
  var fileIterator = backoff (function () {
    return newFolder.getFiles();
  });
  while (fileIterator.hasNext()) {
    Logger.log(fileIterator.next().getName());
  }
  
  // interrupt an iteration
  var fileIterator = backoff (function () {
    return newFolder.getFiles();
  });
  
  for (var i=0;i < 12 && fileIterator.hasNext(); i++) {
    fileIterator.next();
  }
  
  // write a continuation token to property store
  backoff (function () {
    return PropertiesService.getUserProperties().setProperty(
      'continuation', fileIterator.getContinuationToken()
      );
  });
}
function tryContinuation () {
  // continue where we left off
  var token = GoingGasLib.Utils.expBackoff ( function () {
    return PropertiesService
    .getUserProperties()
    .getProperty('continuation');
  });  
  var fileIterator = DriveApp.continueFileIterator(token);

  while (fileIterator.hasNext()) {
    Logger.log(fileIterator.next().getName());
  }
}
