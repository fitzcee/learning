/**
* For use with Going gas videos
* Authorization and authentication
* Service accounts
* needs cGoa library
* MZx5DzNPsYjVyZaR67xXJQai_d-phDA33
* details here
* http://ramblings.mcpher.com/Home/excelquirks/goa
*/
/**
* this stores the credentials for the service in properties
* it should be run once, then deleted
*/
function oneOffStore () {
  // this one connects to onedrive
  var propertyStore = PropertiesService.getScriptProperties();
  
  cGoa.GoaApp.setPackage (propertyStore , {  
    clientId : "0000000048157873",
    clientSecret : "N-0hctAQ7sgih8AVokFNpxS-J8Ia7SEM",
    scopes : ["wl.signin","wl.offline_access","onedrive.readwrite"],
    service: 'live',
    packageName: 'onedrivescripts'
  });
  
}

function doGet (e) {
  return doGetOneDrive (e);
}
/**
* this is how  to do a webapp which needs authentication
* @param {*} e - parameters passed to doGet
* @return {HtmlOurput} for rendering
*/
function doGetOneDrive (e) {
  
  // this is pattern for a WebApp.
  // passing the doGet parameters (or anything else)
  // will ensure they are preservered during the multiple oauth2 processes
  var scriptPropertyStore = PropertiesService.getScriptProperties();
  var userPropertyStore = PropertiesService.getUserProperties();
  
  // this starts with a package copy for a specific user if its needed
  cGoa.GoaApp.userClone(
    'onedrivescripts', 
    scriptPropertyStore , 
    userPropertyStore
  );
  
  // this tells it where the credentials are stored
  var goa = getGoa();
  
  // handling the callback is done automatically
  // you must have this code in to provoke that
  if (goa.needsConsent()) {
    return goa.getConsent();
  }
  
  // now return the evaluated web page
  return HtmlService.createHtmlOutput (
    createWebPage()
  )
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
}
/**
* returns the goa infrastructure for this script
* @return {Goa} the executed goa object
*/
function getGoa (e) {
  var userPropertyStore = PropertiesService.getUserProperties();
  
  // this tells it where the credentials are stored
  return cGoa.GoaApp.createGoa (
    'onedrivescripts',
    userPropertyStore
  ).execute(e);
  
}
function createWebPage () {
  
  return '<h1>Authorization complete</h2>' +
    '<p>Now you can go ahead and use this script ' + 
      'with no further web interaction required</p>';
  
}
/**
* in case you need to reauthorize
*/
function killPackage () {
  getGoa().kill();
}


var filesToConvert = [{
  "id":"1-9A9c8GJAnh7MtKSHmuUmC7dVeogAtKnpCfwOWsSOuM",
  "to":"powerpoint",
  "folder":"/Documents/conversions/"
}, {
  "id":"165pHbC6MLbhVdPd2577eS1CKpygtjuFhRHxwoPRueT8",
  "to":"word" ,
  "folder":"/Documents/conversions/"
}, {
  "id":"1TxZ9Ut5VIOpJF_Zf2KwFtbup4RWCV_8rsCBz4Gkv6SU",
  "to":"excel",
  "folder":"/Documents/conversions/"
}];


var MIME_TYPES = {
  slides:'application/vnd.google-apps.presentation',
  powerpoint:'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pdf:'application/pdf',
  word:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  text:'text/plain',
  docs:'application/vnd.google-apps.document',
  richText:'application/rtf',
  openDocument:'application/vnd.oasis.opendocument.text',
  html:'text/html',
  zip:'application/zip',
  openSheet:'application/x-vnd.oasis.opendocument.spreadsheet',
  excel:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv:'text/csv',
  sheets:'application/vnd.google-apps.spreadsheet'
};



/**
* does the work of the script
* the webapp will have been run once already
* in order to generate the necessary token
*/
function convertAndCopy () {

  // now convert each file and write to oneDrive
  filesToConvert.forEach  (function (d) {
    
    // convert the file type
    var convertedFile = convertFile (d);
    
    // write it to onedrive
    var oneDriveFile = copyToOneDrive (convertedFile);
    
    // show the url for accessing it on onedrive    
    Logger.log (oneDriveFile.webUrl);
    
  });
  
}



/**
* copy a converted file to oneDrive
* @param {object} file the converted file object
* @return {object} the oneDrive response
*/
function copyToOneDrive (file) {
  
  return JSON.parse( 
    UrlFetchApp.fetch (
      'https://api.onedrive.com/v1.0/drive/root:' + 
       file.outputName + 
      ':/content' , { 
          contentType:"text/plain", 
          headers: {
             Authorization: 'Bearer ' + getGoa().getToken()
          },
          payload:file.blob.getBytes(),
          method:"PUT"
       }).getContentText());

}
/**
* convert a list of files to requested type
* @param {object} conversion the id & requested types
* @return {object} the conveted blobs abns various meta information
*/
function convertFile (conversion) {
  
  
  // get the files metadata
  var meta = Drive.Files.get (conversion.id);
  if (!meta) {
    throw 'Couldnt get file id ' + conversion.id;
  }
  
  // check that we know how to convert that
  if (!MIME_TYPES[conversion.to]) {
    throw 'dont know how to convert to ' + conversion.to;
  }
  
  // and that this kind of file supports it
  var exportLink = meta.exportLinks[MIME_TYPES[conversion.to]];
  if (!exportLink){
    throw meta.title + '(' +
      meta.mimeType + ') ' +
        ' cannot be converted to ' + conversion.to;
  }
  
  // now get the blob
  return {
    conversion:conversion,
    meta:meta,
    toType:MIME_TYPES[conversion.to],
    outputName:conversion.folder + 
      meta.title + 
      exportLink.replace(/.*\&exportFormat=(\w+).*/,'.$1'),
    blob:UrlFetchApp.fetch ( exportLink, { 
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
      }
    }).getBlob()
  };
  
}
