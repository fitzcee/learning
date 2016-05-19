/**
 * for use with Going Gas screencasts
 * UrlFetch Service - responses and headers
 */
var TEST_SHEET_NAME = 'allmygists';

function responses() {
  
  // use the github api.
  var API_URL = 
      'https://api.github.com/users/brucemcpherson/gists' + 
      '?per_page=5&page=1';
  
  // get my gists in pages
  var response = UrlFetchApp.fetch(API_URL);  

  // get the response
  var result = JSON.parse(response.getContentText());
  //Logger.log (JSON.stringify(result));
  
  // get the headers
  var headers = response.getAllHeaders();
  //Logger.log(JSON.stringify(headers));
  
  // we can use that to get all the contents
  // it looks like this
  // <https://api.github.com/user/1894020/gists?per_page=2&page=2>; 
  // rel="next", <https://api.github.com/user/1894020/gists?per_page=2&page=37>; rel="last"
  if(headers.Link) {
    var link = /<([^>]*)>;\s?rel="next"/.exec(headers.Link);
    if(link) {
      var newUrl = link[1].toString();
      Logger.log(newUrl);
    }
  }
  
  // put it all together to deal with multi-pages
  for (var url = API_URL, results = []; url ; ) {
    
    // see what query its doing    
    Logger.log(url);
    
    // query the api
    var response = UrlFetchApp.fetch(url); 
  
    // add the result
    results.push.apply (
      results, JSON.parse(response.getContentText())
    );
  
    // get the link for the next page 
    var headers = response.getAllHeaders();
    var match = headers.Link ? 
        /<([^>]*)>;\s?rel="next"/.exec(headers.Link) : null;
    
    // if it was a match there is a new url.
    url = match ? match[1].toString() :'';

  }
  
  // generate a row, one for each filename
  var summary = results.reduce(function (names,item) {
    names.push.apply(names,
      Object.keys(item.files).map(function(key) {
       return {
        description:item.description,
        fileName:item.files[key].filename,
        language:item.files[key].language,
        url:item.files[key].raw_url
       };
     }));
    return names;
  },[]);
  
  // delete previous testsheets
  deleteTestSheets();
  
  // and write to a sheet
  var range = SpreadsheetApp.create(TEST_SHEET_NAME)
    .getActiveSheet()
    .setName('summary')
    .getRange('a1');
  
  // using gaslib functions to convert and write data
  GoingGasLib.SheetUtils
    .objectsToRange(summary , range);
  
  // and why not color the heading row
  GoingGasLib.SheetUtils.rangeFill (
    range.offset(0,0,1,range.getSheet().getLastColumn()), 
    'backgrounds',
    'yellow'
  );
  
}
