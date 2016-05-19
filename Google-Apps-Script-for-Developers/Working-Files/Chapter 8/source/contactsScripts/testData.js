/**
* create a new spreadsheet if necessary
* make test data for manipulat function
* @param {boolean} [force=false] if true then data is always overwritten
* @return {string} the spreadsheet id
*/

function createTestData(force) {
  
  var TEST_DATA_KEY = 'testContactsDataId';
  // if we have the key in properies, already have a sheet
  var store = PropertiesService.getScriptProperties();
  var ssId = store.getProperty(TEST_DATA_KEY);
  if (!ssId) {
    // need to create a spreadsheet
    force = true;
    var ss = SpreadsheetApp.create('testContactsData');
    
    // set the sheet name
    ss.getActiveSheet().setName('contacts');
    
    // get the key & store it for future
    var ssId = ss.getId();
    store.setProperty(TEST_DATA_KEY, ssId);
  }
  
  // one off to create a spreadsheet of test data
  
  if (force) {
    var range = SpreadsheetApp.openById( ssId)
      .getSheetByName('contacts')
      .getDataRange();
    
    range.getSheet().clear();
    
    GoingGasLib.SheetUtils.objectsToRange([
      {
        givenName:"Ryan",
        familyName:"test-Marsh",
        email:"ryan.marsh@mcpher.com"
      },
      {
        givenName:"Rebekah",
        familyName:"test-Willis",
        email:"rebekah.willis@mcpher.com"
      },
      {
        givenName:"Pearl",
        familyName:"test-Dotson",
        email:"pearl.dotson@mcpher.com"
       } ] , range
    );
    
  }
  return ssId;  
}

function cleanTestData () {

  // where the data is
  var range = 
    SpreadsheetApp.openById(createTestData())
    .getSheetByName('contacts')
    .getDataRange()
  
  // get it and delete all contacts by id
  GoingGasLib.SheetUtils.objectifyRange(range).forEach(function(d) {
    var contact = ContactsApp.getContactById(d.contactId);
    if (contact) {
      contact.deleteContact();
    }
  });
}

// delete all the contacts in a group
// and the group as well
function cleanGroupMembers () {
  // first create the group if it doesnt exist
  var group = ContactsApp.getContactGroup(GROUP_NAME);
  
  // delete everyone on it
  if (group) {
    group.getContacts().forEach(function(d) {
      d.deleteContact();
    });
    
    // delete the group
    group.deleteGroup();
  }
  
}