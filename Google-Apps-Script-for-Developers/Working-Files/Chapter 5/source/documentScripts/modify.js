function modify() {
  
  //  boiler plate open working file & get body
  var body = openWorkingBody();
  
  // get first table
  var table = body.getTables()[0];
  
  // clean up extra column from previous runs
  cleanUpExtraColumn (table);
  
  // insert an extra column to the first table
  for (var i=0 , n = table.getNumRows(); i < n ; i++ ) {
    // get the row
    var row = table.getRow(i);
    // insert a cell at row 2, copying text from row 4
    row.insertTableCell(1, row.getCell(1).getText() );
  }
  
  // now use that middle cell to look up duck (miss header)
  for (var i=1 , n = table.getNumRows(); i < n ; i++ ) {
    
    // get the row
    var row = table.getRow(i);
    var cell = row.getCell(1);
    
    // get data from duck
    var duck = getDuck (cell.getText());
    
    // modify the text in the cell to be something like united airlines (UA) 
    cell.editAsText().appendText(
      ' (' + row.getCell(0).getText() + ')' 
    );
    
    // add link if there was one
    if (duck.url) {
      cell.editAsText().setLinkUrl (duck.url);
    }

    
  }
  
  // fix the header
  var headerCell = table.getRow(0).getCell(1);
  headerCell.editAsText().replaceText('.*','site');
  
  headerCell.setBackgroundColor(
    table.getRow(0).getCell(0).getBackgroundColor()
  );
  
}

function cleanUpExtraColumn (table) {
  
  for (var i=0, n = table.getNumRows(); i < n; i++) {
    var row = table.getRow(i);
    while (row.getNumCells() > 2) {
      row.getCell(1).removeFromParent();
    }
  }
  return table;
  
}
