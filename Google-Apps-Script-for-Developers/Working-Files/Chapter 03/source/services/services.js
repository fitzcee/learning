function services() {
  
  // spreadsheet service -
  // https://developers.google.com/apps-script/reference/spreadsheet/
  var ss = SpreadsheetApp.openById(
    '1TxZ9Ut5VIOpJF_Zf2KwFtbup4RWCV_8rsCBz4Gkv6SU'
  );
  
  // returns a sheet class - autocomplete is available
  var sheet = ss.getSheetByName('carriers');
  
  // gets range
  var range = sheet.getDataRange();
  
  // gets the data
  var data = range.getValues();
  Logger.log (JSON.stringify(data));
  
  // contacts service
  // - https://developers.google.com/apps-script/reference/contacts/
  var contact = ContactsApp.createContact(
    'Walter', 'Mitty', 'walter.mitty@mcpher.com'
  );
  
  // get that contact
  var walter = ContactsApp.getContact('walter.mitty@mcpher.com');
  
  // show name
  Logger.log (walter.getFullName() + ' ' + walter.getPrimaryEmail());
  
  // delete it
  ContactsApp.deleteContact(walter); 
  
  // calendar service
  // - https://developers.google.com/apps-script/reference/calendar/
  var calendar = CalendarApp.getDefaultCalendar();
  
  // create an event
  var startTime  = new Date(new Date().getTime()  + 1000 * 60 * 60);
  var endTime  = new Date(startTime.getTime()  + 1000 * 60 * 60);
  
  var event = calendar.createEvent(
    'Meeting in 1 hour', startTime , endTime, {
      location: 'my yacht',
      guests: walter.getPrimaryEmail()
    }
  );
  
  // delete it
  event.deleteEvent();
  
  // Drive service
  // - https://developers.google.com/apps-script/reference/drive/
  // write the data from a sheet to a drive file
  var file = DriveApp.createFile(
    'datafromsheet.json', JSON.stringify(data),MimeType.PLAIN_TEXT
  );
  
  // gmail service
  // - https://developers.google.com/apps-script/reference/gmail/
  //send a mail with the link to the file 
  GmailApp.sendEmail(
    'bruce@mcpher.com', 'data from ' + ss.getName(), 
    'Here is a going gas file you may be interested in' , {
      attachments:[file.getBlob()]
    });
  
  // delete the file from drive
  file.setTrashed(true);
  
  // document service
  // - https://developers.google.com/apps-script/reference/document/
  var doc = DocumentApp.create('servicesdoc');
  var body = doc.getBody();
  
  
  // append a new paragraph
  body.appendParagraph('some text');
  
  // delete the docfile
  var docFile = DriveApp.getFileById(doc.getId());
  docFile.setTrashed(true);
  
  // language service
  // - https://developers.google.com/apps-script/reference/language/language-app
  // get mails and translate them
  var threads = GmailApp.search(
    'has:attachment "going gas file" in:inbox subject:data'
  );
  
  threads.forEach(function (d) {
    d.getMessages().forEach (function (m) {
      Logger.log (
        LanguageApp.translate(m.getPlainBody(), 'en', 'fr')
      );
    });
  });
  
  // maps service
  // - https://developers.google.com/apps-script/reference/maps/
  // find how long to walk 
  var directions = Maps.newDirectionFinder()
  .setOrigin('Trafalgar Square, London W1, UK')
  .setDestination('10 Downing Street, London W1, UK')
  .setMode(Maps.DirectionFinder.Mode.WALKING)
  .getDirections();
  Logger.log(directions.routes[0].legs[0].duration.text);
  
  // sites service
  // - https://developers.google.com/apps-script/reference/sites/
  // get a google site
  var site = SitesApp.getSite('mcpher.com','share');
  Logger.log (site.getTitle());
  
  // groups service
  // - https://developers.google.com/apps-script/reference/groups/
  var groups = GroupsApp.getGroups();
  Logger.log('You are a member of %s Google Groups.', groups.length);
  
  
  // forms service
  // - https://developers.google.com/apps-script/reference/forms/
  var form = FormApp.create('Service form');
  var item = form.addCheckboxItem();
  item.setTitle('Which App service do you us the most?');
  item.setChoices([
    item.createChoice('Spreadsheet'),
    item.createChoice('Docs')
  ]);
  Logger.log(form.getPublishedUrl());
  
  // Script services
  // script cache service 
  // - https://developers.google.com/apps-script/reference/cache/cache-service
  var cache = CacheService.getScriptCache();
  
  // get data using a key
  var key = ss.getId() + sheet.getName() + range.getA1Notation();
  var cacheData = cache.get(key);
  
  // if not found in cache, then read it from sheet
  if (!cacheData) {
    data = range.getValues();
    // write to cache for next time
    cache.put (key, JSON.stringify(data));
  } else {
    data = JSON.parse (cacheData);
  }
  Logger.log (JSON.stringify(data));
  
  // script - properties service
  // - https://developers.google.com/apps-script/reference/properties/properties-service
  var properties = PropertiesService.getScriptProperties();
  
    
  // set a property to length of data read
  properties.setProperty('myprivatething', 'something private');
  
  // get it back
  Logger.log (properties.getProperty('myprivatething'));
  
  // Script URLfetch service
  // - https://developers.google.com/apps-script/reference/url-fetch/
  var response = UrlFetchApp.fetch (
    'http://services.faa.gov/airport/status/IAD?format=json'
  );
  Logger.log (response.getContentText());
  
}
