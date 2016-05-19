function classes() {
  
  // tidy up from previous runs
  ContactsApp.getContactsByName('Jar Jar Binks').forEach(function(d) {
    d.deleteContact();
  });
  
  // contacts service via the contactsApp
  var contact = ContactsApp.createContact(
    'Jar Jar', 'Binks', 'jj@mcpher.com' 
  );
  
  // example fields in the contact 
  contact.addAddress (
    ContactsApp.Field.HOME_ADDRESS,
    '1600 Pennsylvania Ave NW, Washington, DC 20500, Naboo'
  );
  
  // using built in label
  contact.addPhone (
    ContactsApp.Field.HOME_PHONE,
    '+1 202-456-1111'
  );
  
  // custom label
  contact.addPhone (
    'Agents number', 911
  );
  
  // custom fields
  contact.addCustomField(
    'Nuisance factor', 
    ContactsApp.Priority.HIGH
  );
  
  ['The Phantom Menace',
   'Attack of the Clones',
   'Revenge of the Sith'
  ]
  .forEach(function(d,i) {
    contact.addCustomField('Appearance ' + (i+1), d);
  });
  
  // get the custom fields
  contact.getCustomFields().forEach(function(d) {
    Logger.log (d.getLabel() + ':' + d.getValue());
  });
  
  // special getter
  Logger.log(contact.getFullName());
  
  // get regular fields
  contact.getPhones().forEach(function(d) {
    Logger.log (d.getLabel() + ':' + d.getPhoneNumber());
  });
  
  // get specific field
  Logger.log(
    contact.getPhones('Agents number')[0].getPhoneNumber()
  );
  
  //date field with regular label
  contact.addDate(
    ContactsApp.Field.BIRTHDAY, ContactsApp.Month.JULY, 16, 1999
  );
  
  //date field with custom label
  contact.addDate(
    'Started to annoy', ContactsApp.Month.JULY, 17, 1999
  );
  

}
