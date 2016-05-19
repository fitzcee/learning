/**
 * for use with Going Gas videos
 * Advanced versus built in services
 * note that this uses the GoingGasLib library
 * key: MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
 */
function comparison () {
 
  // normally I'd use exponential backoff for  operations
  var backoff = GoingGasLib.Utils.expBackoff;

  // cleanup from previous
  cleanupAdvanced();
  
  // regular service
  backoff( function () {
    return CalendarApp.getAllCalendars();
  }).forEach(function(d) {
    Logger.log (d.getId() + '-' + d.getName());
  });
  
  // advanced service
  // list all calendars
  backoff ( function () { 
    return Calendar.CalendarList.list();
  }).items.forEach(function(d) {
    Logger.log (d.id + '-' + d.summary);
  });
  
  // access to more properties
  var events = backoff ( function () {
    return Calendar.Events.list('bruce@mcpher.com', {
      maxResults:3
    });
  });
  
  // returns the collections resource representation
  Logger.log(JSON.stringify(events));
  
  // additional capabilities.
  // built in driveapp
  // create a folder
  var folder = backoff ( function () {
    return DriveApp.createFolder(TEST_FOLDER);
  });
  
  // use OCR in drive needs advanced service
  
  // get an image
  var blob = GoingGasLib.DocUtils.getImageFromUrl(
    'http://www.firstworldwar.com/' + 
    'source/graphics/backstothewall.jpg'
  ).setName('backstothewall');
  
  //insert the file 
  var file = backoff ( function () {
    return Drive.Files.insert({ 
      title: blob.getName(),
      parents:[{id:folder.getId()}]
    }, blob, {ocr:true});
  });
  
  // it takes a while before it gets indexed
  Utilities.sleep(5000);
  // now we can use regular searching
  var files = backoff (function () {
      return  folder.searchFiles (
        "fullText contains 'three weeks ago'"
      ); 
  })
  Logger.log (files.next().getName());
  
  // inbox snippets
  backoff( function () {
    return Gmail.Users.Threads.list('me', {
      maxResults:10,
      q:'label:promotions'
    });
  })
  .threads.forEach(function (d) {
    Logger.log (d.snippet);
  });
}