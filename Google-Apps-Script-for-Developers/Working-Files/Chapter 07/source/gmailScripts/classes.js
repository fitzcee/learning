function classes() {
  
  // the mail service cannot access your gmail accounts
  Logger.log(MailApp.getRemainingDailyQuota());
  
  //send a simple email
  MailApp.sendEmail(
    'bruce@mcpher.com', 
    'using the mail service screencast', 
    'Using the mail service to send myself a mail'
  );
   // a more complcated mail
  
  // get an image to inline
  var bookBlob = DriveApp.getFileById('0B92ExLh4POiZM2lwOFNhNkZDbE0')
     .getBlob()
     .setName('bookBlob');
  
  // just some of the options available
  MailApp.sendEmail ({
    to:'bruce@mcpher.com',
    subject:'using the mail service screencast',
    inlineImages:{
      bookCover:bookBlob
    },
    htmlBody:'<h1>mail demo</h1>' +
    'Going Gas book cover: <br><img src="cid:bookCover">',
    attachments:[bookBlob]
  });
  
  // messages are organized by threads
  var threads = GmailApp.search(
    'subject:"using the mail service screencast"'
  );
  Logger.log(threads.length + ' matching threads');
  
  // messages are the children of a thread
  var messages = threads[0].getMessages();
  Logger.log(messages[0].getPlainBody());
  
  // attachments are associated with messages
  threads.forEach(function(d) {
    d.getMessages().forEach(function(e) {
      e.getAttachments().forEach(function(f) {
        Logger.log('attachment:' + f.getName());
      });
    });
  });
  
  // can use the gmailapp instead of the mailapp
  GmailApp.sendEmail(
    'bruce@mcpher.com', 
    'using the mail service screencast', 
    'Using the mail service to send myself a mail with the GmailApp'
  );
  
  
  // labels are attached to threads, get or create one
  var LABEL_NAME = 'classesScreencast';
  var label = GmailApp.getUserLabelByName(LABEL_NAME) ||
    GmailApp.createLabel(LABEL_NAME);
  
  // associate with the thread
  threads.forEach(function(d) {
    d.addLabel(label);
  });
  
  var threads = GmailApp.search('label:' + label.getName());
  Logger.log(threads.length + ' associated with ' + label.getName());
  
  // delete them all again
  threads.forEach(function(d) {
    d.moveToTrash();
  });
  
}
