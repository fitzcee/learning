var GROUP_NAME = 'test contact group';

function contactGroups() {
  
  // will create test data if none found
  var range = SpreadsheetApp.openById(createTestData())
  .getSheetByName('contacts')
  .getDataRange()
  
  // the data
  var contactData = GoingGasLib.SheetUtils.objectifyRange(range);
  
  // first create the group if it doesnt exist
  var group = ContactsApp.getContactGroup(GROUP_NAME) ||
    ContactsApp.createContactGroup(GROUP_NAME);
  
  // and the people in it
  var members = group.getContacts();
  
  // get a array of contacts that have been added to the group
  var additions = contactData.map (function(d) {
    
    var matches = ContactsApp.getContactsByEmailAddress(d.email);
    return matches.length ? 
      matches :
      [ContactsApp.createContact(
        d.givenName, d.familyName, d.email)
      ];
  })
  .reduce (function(p,c) {
    // actually it will be an array of matches,
    // so take the first one whose primary email matches
    var primary = c.filter(function(d) {
      return d.getEmails().some(function(e) {
        return e.isPrimary();
      });
    });
    if (primary.length) {
      p.push(primary[0]);
    }
    return p;
  },[])
  .filter (function(contact) {
    // add to the group if they are not in it
    return members.some(function(member) {
      return member.getId() === contact.getId();
    }) ? false : group.addContact(contact);
  });
  
  // now we also have an array of new members - so we could, 
  // for example - send an email to existing members about new ones
  if (additions.length) {
    members.forEach(function (member) {
      MailApp.sendEmail(
        member.getEmails()[0].getAddress(),
        'New members of ' + group.getName(),
        'Hello ' + member.getGivenName() + '\n\n' +
        'Please welcome the following members to our group\n' +
          additions.map (function(contact) {
            return contact.getFullName();
          }).join('\n'));
    });
  }
  
  
}
