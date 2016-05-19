function classes() {
  // using the nasa API
  // its ino is stored in properties
  var api = Fetcher.getApi ('nasa');
  
  
  // do a simple get, no options
  // find any asteroids approached earth
  // in the past week
  var now = new Date();
  var start = new Date(
    now.getFullYear(), now.getMonth()  , now.getDate() -7
  );
  var finish = new Date(
    now.getFullYear(), now.getMonth()  , now.getDate() 
  );
  
  
  // construct the url and get an httpr reponse
  var response = UrlFetchApp.fetch(
    api.baseUrl + 
    'neo/rest/v1/feed?api_key=' + api.key + 
    '&end_date=' + 
    Utilities.formatDate(finish,Session.getScriptTimeZone(),"yyyy-MM-dd") + 
    '&start_date=' +
      Utilities.formatDate(
        start,Session.getScriptTimeZone(),"yyyy-MM-dd"
      )
    );
  
  // get the status code - 200 is good
  if (response.getResponseCode() !== 200) {
    throw 'failed with error code ' + response.getResponseCode();
  }
  
  // get the result
  var result = JSON.parse ( response.getContentText() );
  //Logger.log(JSON.stringify(result));
  
  // get co-ords of google HQ
  var pos = Maps
  .newGeocoder()
  .geocode("1600 Amphitheatre Parkway,Mountain View, CA 94043");
  
  // get a landsat image
  var response = UrlFetchApp.fetch(
    api.baseUrl + 
    'planetary/earth/imagery?api_key=' + api.key + 
    '&lon=' + pos.results[0].geometry.location.lng +
    '&lat=' + pos.results[0].geometry.location.lat + 
    '&date=' + Utilities.formatDate(new Date(2015,6,4),Session.getScriptTimeZone(),"yyyy-MM-dd")
  );
  
  
  // get the result
  var result = JSON.parse ( response.getContentText() );
  var blob = UrlFetchApp.fetch(result.url)
  .getBlob()
  .setName('googlehq.png');
  
  // how about writing the satellite image to drive
 DriveApp.createFile(blob);

  // get an image from Mars Curiosity rover mast camera on xmas day
  var response = UrlFetchApp.fetch(
    api.baseUrl + 
    'mars-photos/api/v1/rovers/curiosity/photos?api_key=' + api.key + 
    '&camera=mast' +
    '&earth_date=' + 
    Utilities.formatDate(
    new Date(2015,11,25),
      Session.getScriptTimeZone(),
        "yyyy-MM-dd"
        )
        );
  
  // get the result
  var result = JSON.parse ( response.getContentText() );
  //Logger.log(JSON.stringify(result));
  
  if (!result.photos.length) {
    throw 'no photos';
  }
  
  // mail the image to myself
  var mastBlob = UrlFetchApp.fetch(result.photos[0].img_src)
  .getBlob()
  .setName('mast camera-'+result.photos[0].earth_date);
  
  MailApp.sendEmail ({
    to:'bruce@mcpher.com',
    subject:'pictures from mars',
    inlineImages:{
      mast:mastBlob
    },
    htmlBody:'<h1>' + mastBlob.getName() + '</h1>' +
    'heres the photo: <br><img src="cid:mast">'
  });
  
  // using get request for debugging
  Logger.log(
    JSON.stringify(
      UrlFetchApp.getRequest(result.photos[0].img_src)
    )
  );
  
  var result = UrlFetchApp.fetch ('https://api.twitter.com/', {
    muteHttpExceptions:true
  });
  
  Logger.log(result.getResponseCode());
  
}