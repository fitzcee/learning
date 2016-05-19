/**
* For use with Going gas videos
* Authorization and authentication
* needs cGoa library
* MZx5DzNPsYjVyZaR67xXJQai_d-phDA33
* details here
* http://ramblings.mcpher.com/Home/excelquirks/goa
*/
function doGet (e) {
  return doGetPeople (e)
}
/**
* this stores the credentials for the service in properties
* it should be run once, then deleted
*/
function oneOffStore () {
  
  var propertyStore = PropertiesService.getScriptProperties();
  cGoa.GoaApp.setPackage (propertyStore , {  
    clientId : "282568946991-s9pdtu5vhkkl7750b8rob0tachcsll0p.apps.googleusercontent.com",
    clientSecret : "loY39j8cqG_WitcdW8bJliH3",
    scopes : cGoa.GoaApp.scopesGoogleExpand (
      ['userinfo.profile','userinfo.email']
    ),
    service: 'google',
    packageName: 'peopleGoingGasWeb'
  });
}
/**
* this is how  to do a webapp which needs authentication
* @param {*} e - parameters passed to doGet
* @return {HtmlOurput} for rendering
*/
function doGetPeople (e) {
  
  // this is pattern for a WebApp.
  // passing the doGet parameters (or anything else)
  // will ensure they are preservered during the multiple oauth2 processes
  var scriptPropertyStore = PropertiesService.getScriptProperties();
  var userPropertyStore = PropertiesService.getUserProperties();
  
  // this starts with a package copy for a specific user if its needed
  cGoa.GoaApp.userClone(
    'peopleGoingGasWeb', 
    scriptPropertyStore , 
    userPropertyStore
  );
  
  // this tells it where the credentials are stored
  var goa = cGoa.GoaApp.createGoa (
    'peopleGoingGasWeb',
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
  
  // This is a webapp doing whaever its supposed to do
  // getParams is used to retrieve the original parameters passed to this function
  var result = testPeople (
    goa.getToken(), goa.getParams()
  );   
  // now return the result as normal
  return HtmlService.createHtmlOutput (
    createWebPage(result.getContentText())
  )
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);

}



function createWebPage (textResult) {
  
  var data = JSON.parse (textResult);

  return '<h1>People data</h1>' +
      '<p>From the new People API</p>' +
      '<h2>Here are the Urls for ' + 
      data.names[0].displayName + '</h2>' +
      '<table><tr><th>parameter</th>' + 
      '<th>value</th></tr>' +
       data.urls.map(function(d) {
         return '<tr><td>' + d.value + '</td>' + 
           '<td>' + d.formattedType  + '</td></tr>';
       }).join('\n') + '</table>';

}

/**
* this can be called directly if authorization has been previously done
*/
function testLater (e) {
  
  // pick up the token refreshing if necessary
  var goa = cGoa.GoaApp.createGoa (
    'peopleGoingGasWeb',
    PropertiesService.getScriptProperties()
  ).execute(e);
  
  // If this happens then you havent successfully run a webapp 
  // to provoke a dialog
  if (!goa.hasToken()) {
    throw 'for a non webapp version - ' + 
      'first publish once off to provoke a dialog - ' + 
        ' token will be refreshed automatically thereafter';
  }
  
  // do a test - passing the token and any parameters that arrived to this function
  Logger.log (testPeople (goa.getToken(), goa.getParams() ));
  
} 

/**
* this is your main processing - will be called with your access token
* @param {string} accessToken - the accessToken
* @param {*} params any params
*/
function testPeople (accessToken,params) {
  
  var options = {
    method: "GET",
    contentType : "application/json" ,
    muteHttpExceptions : true,
    headers: {
      "authorization": "Bearer " + accessToken,
    }
  };
  
  return UrlFetchApp.fetch( 
    "https://people.googleapis.com/v1/people/me?fields=" + 
    encodeURIComponent ("emailAddresses,names,urls"), 
    options  
    );
  
}