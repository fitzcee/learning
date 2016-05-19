function elements () {
  
  // open the working file
  var doc = DocumentApp.openById(
    DriveApp.getFilesByName(DOC_NAME).next().getId()
  );

  // get the body and clear it
  var body = doc.getBody();
  
  // this avoids clear error if nothig in doc.
  body.appendParagraph('');
  body.clear();
  
  // say what we are going to do
  body.appendParagraph("Here's what'll happen")
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  
  body.appendParagraph(
    'This will demo adding different kinds of elements to a document'
  );
  
  body.appendListItem('Get data from a sheet');
  body.appendListItem('Make it into a table');
  body.appendListItem('Create a paragraph for each item');
  body.appendListItem('Look up abstract in external api');
  body.appendListItem('translate it to the selected language');
  
    // open the carriers worksheet for some test data
  var sheet = SpreadsheetApp.openById(
      '1dtOVzG7Sa1rLxnrGejGl5sixPCpm4zLELOEudh5N4y4'
    )
    .getSheetByName('carriers');
  
  var data = sheet
    .getDataRange()
    .getValues();
  
  // put a heading for the table
  body.appendParagraph('The data')
    .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  body.appendParagraph (
    "Here's the data from the spreadsheet " + sheet.getName()
  );
  
  // make a table - can take an array of arrays
  var table = body.appendTable(data);
  
  // change the background color of the first row
  var row = table.getRow(0);
  for (var i=0; i < row.getNumChildren(); i++) {
    row.getCell(i).setBackgroundColor('#FFFF99');
  }
  
  // put a heading for the translations in each language
  ['en','fr','zh-CN'].forEach(function(d) {
    
    body.appendParagraph(translate('Abstract of each table entry','en',d))
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    
    // some abstract info about each row
    data.forEach(function (r,i) {
      // skip the header row
      if (i) {
        body.appendParagraph(r[1])
        .setHeading(DocumentApp.ParagraphHeading.HEADING3);
        
        // get stuff about it from API
        var itemData = getDuck (r[1]);
        
        //add an image if there is one
        var img = getImageFromUrl (itemData.image);
        if (img) {
          imageScale(body.appendImage(img),100);
        }
        
        // translate it and write about it
        body.appendParagraph(
          translate(itemData.abstract,'en',d,r[1])
        );
      }
    })
  });

}

/**
 * execute a duckduckgo query and return cached abstract
 * @param {string} query the string to search duckduckgo.com on
 * @param {boolean} [useCache=true] whether to attempt to use cache
 * @return {object} the query abstract and image
 */
function getDuck (query, useCache) {
  
  // use cache?
  var useCache = typeof useCache === typeof undefined ? true : useCache;
  var cache = CacheService.getScriptCache();
  var key = 'getAbstract:'+query;
  
  if (query) {
    
    // see if its in cache
    var result = useCache ? cache.get(key) : null;

    if (!result) {
      // do the query
      var response = UrlFetchApp.fetch(
        'https://api.duckduckgo.com/?q=' 
        + encodeURIComponent(query) 
      + '&format=json'
      );
    
      // convert the result
      var result = response.getContentText() ;
    }

    // update cache
    cache.put (key , result);
  
    // convert to an object
    var data = JSON.parse(result);

    // create a result- need to remove double quotes from image url
    return {
      abstract: data.Abstract ? data.Abstract : 'no abstract found',
      image:data.Image.replace(/['"]+/g, ''),
      url:data.Results && data.Results.length ? 
        data.Results[0].FirstURL : ''
    }

  }
  else {
    return {};
  }
  
}

/**
 * scale to given width
 * @param {InlineImage} inlineImage the image
 * @param {number} width the target width
 * @return {InlineImage} for chaining
 */
function imageScale (inlineImage, width) {

  inlineImage.setHeight(
    inlineImage.getHeight() * width / inlineImage.getWidth()
  );
  inlineImage.setWidth(width);
  
  return inlineImage;
  
}

/**
 * get an image from a url
 * @param {string} imageUrl the image url
 * @return {Blob|null} te image
 */
function getImageFromUrl (imageUrl) {

  if (!imageUrl) return null;

  // needs some error handling
  return UrlFetchApp.fetch(imageUrl).getBlob() ;

}


function translate ( text , sourceLanguage, targetLanguage, textKey  ) {
  
  // nothing to do
  if (sourceLanguage === targetLanguage) return text;
  
  // use cache
  var cache = CacheService.getScriptCache();
  var key = 'translate' +
    sourceLanguage +
    targetLanguage +
    (textKey||text);
  
  // the languageapp has a cap on no of chars, so do it in bits.
  var translation = cache.get(key) || 
    LanguageApp.translate(text, sourceLanguage, targetLanguage); 
  
  cache.put(key,translation);
  
  return translation;
  
}
