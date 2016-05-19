/**
* For use with Going gas videos
* Authorization and authentication
* needs cGoa library
* MZx5DzNPsYjVyZaR67xXJQai_d-phDA33
*/


/**
* a script published as a web app
* will get called at this entry point when 
* accessed with an http GET
* @param {object} e this contains url arguments
* @return {HtmlOutput|TextOutput} html or content service create these
*/
function doGet (e) {
  
  // first thing to do is to write the parameters to cache
  setParameters (e);
  
  return HtmlService.createHtmlOutput(
    createWebPage (e)
  )
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
/**
* a script published as a web app
* will get called at this entry point when 
* accessed with an http POST
* @param {object} e this contains url arguments and the payload
* @return {HtmlOutput|TextOutput} html or content service create these
*/
function doPost (e) {
  
}
/**
* @param {object} e the doGet args
* @return {string} the web site
*/

function createWebPage(e) {

  // various ways of doing the same thing
  if (!e.parameter.template) {
    return '<h1>A web site</h1>' +
      '<p>Can be created dynamically' +
      ' by Apps Script</p>' +
      '<h2>Here are the parameters</h2>' +
      '<table><tr><th>parameter</th>' + 
      '<th>value</th></tr>' +
       Object.keys(e.parameter).map(function(k) {
         return '<tr><td>' + k + '</td>' + 
           '<td>' + e.parameter[k]  + '</td></tr>';
       }).join('\n') + '</table>';
  }
  else {
    return HtmlService
    .createTemplateFromFile(e.parameter.template)
    .evaluate()
    .getContent();
  }
}
/*
 * template is asking for the parameters
 * @return {object} the parameters
 */
function getParameters () {
  var result = JSON.parse(getCache()
  .get(getKey()));
  return result;
}

/*
 * set the cache with the parameters
 * @param {object} the parameters
 */
function setParameters (e) {
  return getCache()
  .put(getKey(),JSON.stringify(
    Object.keys(e.parameter).map(function(k) {
      return {parameter:k,value:e.parameters[k]};
    })));
}
/*
 * get the cache key fpr the params
 * @return {string} the cache key
 */

function getKey () {
  return ScriptApp.getProjectKey()+'-templatedemo';
}

/*
 * get the cache to use for the params
 * @return {Cache} the cache 
 */
function getCache () {
  return CacheService.getUserCache();
}