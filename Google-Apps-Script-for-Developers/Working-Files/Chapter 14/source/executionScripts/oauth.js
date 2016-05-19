
/**
* this stores the credentials for the service in properties
* it should be run once, then deleted
* scopes should match the target script
*/
function oneOffStore () {

  var propertyStore = PropertiesService.getScriptProperties();
  cGoa.GoaApp.setPackage (propertyStore , {  
    clientId : "340260419855-2jl9k4ed2gutaukbhc7tbioud9341hg0.apps.googleusercontent.com",
    clientSecret : "wo85Z_fu70QtFMFqG0KOoLxB",
    scopes : cGoa.GoaApp.scopesGoogleExpand ([
      'spreadsheets',
      'drive',
      'script.external_request',
      'script.storage'
    ]),
    service: 'google',
    packageName: 'execution'
  });
}

function doGet (e) {
  
  // this is pattern for a WebApp.
  // passing the doGet parameters (or anything else)
  // will ensure they are preservered during the multiple oauth2 processes
  var scriptPropertyStore = PropertiesService.getScriptProperties();
  
  // this tells it where the credentials are stored
  var goa = getGoa(e);
  
  // handling the callback is done automatically
  // you must have this code in to provoke that
  if (goa.needsConsent()) {
    return goa.getConsent();
  }
  
  // if we get here its time for your webapp to run 
  // and we should have a token, or thrown an error somewhere
  if (!goa.hasToken()) {
    throw 'something went wrong with goa ' +
      ' - did you check if consent was needed?';
  }
  
  // now return the evaluated web page
  return HtmlService.createHtmlOutput (
    createWebPage()
  )
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);

}
function createWebPage () {
  
  return '<h1>Authorization complete</h2>' +
    '<p>Now you can go ahead and use this script ' + 
      'with no further web interaction required</p>';
  
}
/**
* returns the goa infrastructure for this script
* @return {Goa} the executed goa object
*/
function getGoa (e) {
  var propertyStore = PropertiesService.getScriptProperties();
  
  // this tells it where the credentials are stored
  return cGoa.GoaApp.createGoa (
    'execution',
    propertyStore
  ).execute(e);
  
}
