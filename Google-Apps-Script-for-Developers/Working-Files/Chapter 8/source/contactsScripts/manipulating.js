function manipulating() {
  
  // the data range
  // will create test data if none found
  var range = 
    SpreadsheetApp.openById(createTestData())
    .getSheetByName('contacts')
    .getDataRange();
  
  // the data
  var contactData = GoingGasLib.SheetUtils.objectifyRange(range);

  // add or insert data from the sheet to the contacts data
  contactData.forEach(function(d) {
    
    // find by id, or create a new one
    var contact = ContactsApp.getContactById(d.contactId) || 
      ContactsApp.createContact(
        d.givenName, d.familyName, d.email
      );
    
    // update any data from the sheet   
    contact.setFamilyName(d.familyName);
    contact.setGivenName(d.givenName);

    // have to fiddle around with the email addresses
    // allow multiple emails, but make the given one the primary
    if (!contact.getEmails().some ( function(e) {
        return e.getAddress() === d.email;
    })) {
      contact.addEmail(ContactsApp.Field.HOME_EMAIL, d.email);
    }   
    
    // now set this given one to the primary
    contact.getEmails().filter(function(e) {
      return e.getAddress() === d.email;
    })[0].setAsPrimary();
    
    // set the id as this one
    d.contactId = contact.getId();
  });
  
  // now write it back to the sheet
  GoingGasLib.SheetUtils.objectsToRange( contactData , range);
}
