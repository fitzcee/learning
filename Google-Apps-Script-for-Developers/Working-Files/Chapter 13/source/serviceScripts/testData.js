
function getCarrierDataRange () {
  // open the carriers worksheet for some test data
  return SpreadsheetApp.openById(
    '1dtOVzG7Sa1rLxnrGejGl5sixPCpm4zLELOEudh5N4y4'
  )
  .getSheetByName('carriers')
  .getDataRange();
}

