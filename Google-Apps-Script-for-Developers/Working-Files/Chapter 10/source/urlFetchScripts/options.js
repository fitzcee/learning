/**
* IMPORTANT:remember to set up a requestbim before running this
*/
function options() {
  // use request bin to examine what's being sent
  // http://requestb.in/
  
  // get your own requestbin and substitute here
  var url = 'http://requestb.in/1ht82q51';
  
  // the http method
  // GET
  var result = UrlFetchApp.fetch(url, {
    method:"GET"
  });
  
  // PUT
  var result = UrlFetchApp.fetch(url, {
    method:"PUT",
    payload:JSON.stringify({
      data:"some data to put"
    })
  });
  
  // POST
  var result = UrlFetchApp.fetch(url, {
    method:"POST",
    payload:JSON.stringify({
      data:"some data to post"
    })
  });
  
  // DELETE
  var result = UrlFetchApp.fetch(url, {
    method:"DELETE"
  });
  
  // POST with content type
  var result = UrlFetchApp.fetch(url, {
    method:"POST",
    contentType:"application/json",
    payload:JSON.stringify({
      data:"some json type data to post"
    })
  });
  
  // POST with content type and headers
  var result = UrlFetchApp.fetch(url, {
    method:"POST",
    contentType:"application/json",
    headers: {
     "accept" :"application/vnd.github.v3+json"
    },
    payload:JSON.stringify({
      data:"post with headers"
    })
  });
  
  // POST with access token 
  var result = UrlFetchApp.fetch(url, {
    method:"POST",
    contentType:"application/json",
    headers: {
      authorization:"Bearer y123.abcdefghjkklmnopqst"
    },
    payload:JSON.stringify({
      data:"post with access token in header"
    })
  });
  
  // POST with basic authentication
  var result = UrlFetchApp.fetch(url, {
    method:"POST",
    contentType:"application/json",
    headers: {
      authorization : "Basic " + 
        Utilities.base64Encode("user:password")
    },
    payload:JSON.stringify({
      data:"post with basic auth in header"
    })
  });
}
