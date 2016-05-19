/**
* For use with Going gas videos
* Authorization and authentication
* Service accounts
* needs cGoa library
* MZx5DzNPsYjVyZaR67xXJQai_d-phDA33
* details here
* http://ramblings.mcpher.com/Home/excelquirks/goa
*/
function doGet (e) {
  return doGetBlogger (e)
}
/**
* this stores the credentials for the service in properties
* it should be run once, then deleted
*/
function oneOffStore () {
  
  var propertyStore = PropertiesService.getScriptProperties();
  cGoa.GoaApp.setPackage (propertyStore , {  
    clientId : "282568946991-4r5s7759bj4v1hrrgm3uhk0dqnna7li3.apps.googleusercontent.com",
    clientSecret : "k_MoEB_5-GUQe0juuHLDuS8v",
    scopes : cGoa.GoaApp.scopesGoogleExpand (
      ['blogger.readonly']
    ),
    service: 'google',
    packageName: 'bloggerGoingGasWeb'
  });
}
/**
* this is how  to do a webapp which needs authentication
* @param {*} e - parameters passed to doGet
* @return {HtmlOurput} for rendering
*/
function doGetBlogger (e) {
  
  // this is pattern for a WebApp.
  // passing the doGet parameters (or anything else)
  // will ensure they are preservered during the multiple oauth2 processes
  var scriptPropertyStore = PropertiesService.getScriptProperties();
  var userPropertyStore = PropertiesService.getUserProperties();
  
  // this starts with a package copy for a specific user if its needed
  cGoa.GoaApp.userClone(
    'bloggerGoingGasWeb', 
    scriptPropertyStore , 
    userPropertyStore
  );
  
  // this tells it where the credentials are stored
  var goa = cGoa.GoaApp.createGoa (
    'bloggerGoingGasWeb',
    userPropertyStore
  ).execute(e);
  
  
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

/**
 * called from template to get posts
 */

function getPosts (e) {
  
 // pick up the token refreshing if necessary
  var goa = cGoa.GoaApp.createGoa (
    'bloggerGoingGasWeb',
    PropertiesService.getUserProperties()
  ).execute(e);
  
  // If this happens then you havent successfully run a webapp 
  // to provoke a dialog
  if (!goa.hasToken()) {
    throw 'no token';
  }
  
  // utlfetch options
  var options = {
    method: "GET",
    contentType : "application/json" ,
    muteHttpExceptions : true,
    headers: {
      "authorization": "Bearer " + goa.getToken(),
    }
  };
  
  // get the posts owned by this user
  var blogs = JSON.parse(UrlFetchApp.fetch( 
    "https://www.googleapis.com/blogger/v3/users/self/blogs",
    options  
  ).getContentText());

  // lets use the first one.
  var id = blogs.items[0].id;
  
  // now get the posts
  return JSON.parse(UrlFetchApp.fetch( 
    "https://www.googleapis.com/blogger/v3/blogs/" + 
    id + "/posts?fields=" + 
    "items(author%2Cpublished%2Ctitle)", 
    options  
  ).getContentText());
}

function createWebPage () {
  
  return HtmlService
  .createTemplateFromFile('template')
  .evaluate()
  .getContent();
}

