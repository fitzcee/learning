function classes() {
  
  // open test document
  var files = DriveApp.getFilesByName(DOC_NAME);
  var doc = DocumentApp.openById(files.next().getId());
  
  
  // see how many paragraphs in the body
  var body = doc.getBody();
  Logger.log (body.getParagraphs().length);
  
  // the types of element
  body.getParagraphs().forEach(function(d) {
    Logger.log(d.getType());
  });
  
  // paragraphs are container elements and can contain other elements
  var para = body.appendParagraph('heres an image');
  
  // inline images
  var inlineImage = para.appendInlineImage(
    DriveApp.getFileById('0B92ExLh4POiZM2lwOFNhNkZDbE0').getBlob()
  );
  
  // make it smaller
  inlineImage.setHeight(inlineImage.getHeight()/2);
  inlineImage.setWidth(inlineImage.getWidth()/2);
  
  // a table
  var table = body.appendTable();
  
  // a row
  var row = table.appendTableRow();
  
  // a cell
  row.appendTableCell('first cell');
  row.appendTableCell('second cell');
  
  // ranges and range builders
  var range = doc.newRange()
    .addElement(para)  
    .addElement(table)
    .build();
  
  // range elements are the components of a range
  range.getRangeElements().forEach(function(d,i) {
    Logger.log (i + ':' + d.getElement().getType());
  });
  
}