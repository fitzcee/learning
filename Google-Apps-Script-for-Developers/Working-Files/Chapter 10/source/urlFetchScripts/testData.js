/**
 * using these APIS
 * remember to apply for your own api keys
 * and enter them in script properties
 * https://api.nasa.gov
 */
function setKeys () {
  Fetcher.setApi ('nasa' , {
    "key":"DEMO_KEY",
    "baseUrl":"https://api.nasa.gov/"
  });

}

/**
* delete any test sheets
*/
function deleteTestSheets() {

  var files = DriveApp.getFilesByName(TEST_SHEET_NAME);
  while (files.hasNext()) {
    files.next().setTrashed(true);
  }
  
}

