/**
* for use with Going Gas screencasts
* UrlFetch Service - exponential backoff
*/
function backoff() {
  
  // use the github api.
  var API_URL = 
      'https://api.github.com/users/brucemcpherson/gists' + 
        '?per_page=2';  
  
  // make it fail
  //for (var i=0; i < 200 ; i++) {
  //  var response = UrlFetchApp.fetch(API_URL);
  //}
  
  // do it with exponential backoff
  for (var i=0; i < 10 ; i++) {
    
    var response = GoingGasLib.Utils.expBackoff (
      // the thing to execute
      function () {
        return UrlFetchApp.fetch(API_URL);
      },{
        // whether this error is worth retrying
        checker:function (err) {
          return err.toString()
            .indexOf('API rate limit exceeded') !== -1;
        }
      });
    
  }
  
  // for apps script and other common errors
  var response = GoingGasLib.Utils.expBackoff(function () {
    return GmailApp.getTrashThreads(); 
  });
}
