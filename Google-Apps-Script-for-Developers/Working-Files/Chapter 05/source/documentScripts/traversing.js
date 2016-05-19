// we'll be adding a new section 
var MAP_HEADING = "Here's a map of the document";

function traversing () {
  
  // open the working file
  var doc = DocumentApp.openById(
    DriveApp.getFilesByName(DOC_NAME).next().getId()
  );

  // get the body and clear it
  var body = doc.getBody();
  
  // get rid of map from previous runs
  getRidOfTheMap (body);
  
  // generate a new one by traversing the document
  var theMap  = DocUtils.getMap(body);

  // add map to the document
  body.appendParagraph(MAP_HEADING)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);

  // append the map
  theMap.forEach(function(d) {
    body.appendParagraph(d);
  });  
  
}

function getRidOfTheMap (body) {

  // so first delete anything after the map in case its a repeat
  var paras = body.getParagraphs();
  
  // add this to avoid deleting the last paragraph in a document
  body.appendParagraph('');
  
  paras.reduce(function (p,c) {
    p = p || c.getText() === MAP_HEADING;
    if (p) {
      c.removeFromParent();
    }
    return p;
  },false);
  
  return body;
}
