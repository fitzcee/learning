var DOC_NAME = 'workingDocumentClasses';

function createBlankDocument () {

  // delete any existing documents
  var files = DriveApp.getFilesByName(DOC_NAME);
  while (files.hasNext()) {
    files.next().setTrashed(true);
  }
  // create a blank document
  newDocument =  DocumentApp.create (DOC_NAME);
  
  // create each of the document sections
  var footer = newDocument.addFooter();
  var header = newDocument.addHeader();
  var body = newDocument.getBody();
  
  // add some text
  footer.appendParagraph('this is the footer');
  header.appendParagraph('this is the header');
  
  // body starts with an existing paragraph
  var para = body.getParagraphs()[0];
  
  // so write something to it.
  para.appendText('here is the first paragraph');
  
  // add another paragraph
  body.appendParagraph('here is the second paragraph');

}

function openWorkingBody () {
    // open the working file
  var doc = DocumentApp.openById(
    DriveApp.getFilesByName(DOC_NAME).next().getId()
  );

  // get the body and clear it
  var body = doc.getBody();

  // get rid of map from previous runs
  getRidOfTheMap (body);
  
  return body;
}
