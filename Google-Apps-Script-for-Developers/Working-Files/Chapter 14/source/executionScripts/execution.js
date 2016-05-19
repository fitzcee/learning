/**
* For use with Going gas videos
* executionAPI
* needs cGoa library
* MZx5DzNPsYjVyZaR67xXJQai_d-phDA33
* details here
* http://ramblings.mcpher.com/Home/excelquirks/goa
*
* executing project 	
* MAoh6mYOrEZmrPXIRgrBt4ai_d-phDA33
*/

function execution() {
  // check token is in order
  var goa = getGoa();
  if(!goa.hasToken()) {
    throw 'you need to have set up oauth2 via a web app before this will work';
  }
  
  // the parameters
  var payload =  JSON.stringify({
    "function":"process",
    "devMode":true,
    "parameters":[getTestParameters()]
  });
  
  // now call the remote project
  var result = UrlFetchApp
  .fetch ( 
    "https://script.googleapis.com/v1/scripts/" + 
    getExecutionProjectKey() + ":run", {
    method:"POST",
    payload: payload,
    contentType: "application/JSON",
    headers: {
      "Authorization":"Bearer " + goa.getToken()
    }
  });
  
  Logger.log(result.getContentText());
  
}

/**
* get the key of the project that has been published
* as an execution Api
* @return {string} the project key
*/
function getExecutionProjectKey () {
  return PropertiesService
  .getScriptProperties()
  .getProperty('executeKey');
}