function threads() {
  // get matching threads
  var threads = GmailApp.search(
    'subject:"using the mail service screencast"'
  );
  
  // just us the first one
  var thread = threads[0];
  
  // how many messages in first thread
  var messages = thread.getMessages();
  Logger.log(messages.length);
  
  // show message contents
  messages.forEach(function(d) {
    Logger.log ('plain:' + d.getPlainBody());
    Logger.log ('regular:' + d.getBody());
    Logger.log ('raw:' + d.getRawContent());
  });
    
  // replying to a thread
  thread.reply('i got it');
  
  // get the thread
  var threads = GmailApp.search(
    'subject:"using the mail service screencast" "i got it"'
  );
  
  // in case it hasnt happened yet
  if (!threads.length) {
    throw 'mail hasnt arrived yet - try again';
  }
  
  // use the first thread
  var thread = threads[0];
  
  // get some thread level info
  Logger.log (thread.getMessageCount());
  Logger.log (thread.getFirstMessageSubject());
  Logger.log (thread.getLastMessageDate());
  
  // in case it hasnt happened yet
  if (!thread.getMessageCount()) {
    throw 'messages havent arrived yet - try again';
  }
  
  // extract the messages
  var messages = thread.getMessages();
  
  // filter the messages
  var message = messages.filter(function(d) {
    return d.getPlainBody().indexOf("i got it") !== -1;
  })[0];
  
  // find out who it was from
  Logger.log(message.getFrom());
  
  // star it
  message.star();  
  Logger.log ('starred? '+ message.isStarred());
  
  // threads can be marked.
  thread.markImportant();
  
  
}
