function searching() {
  
  // all of the same syntax for gui advacned search
  // can be used in the search method
  // https://support.google.com/mail/answer/7190?hl=en
  
  // get matching threads
  var threads = GmailApp.search(
    'subject:"using the mail service screencast"'
  );
  Logger.log(threads.length);
  
  // show the subject & date for each thread
  threads.forEach(function(d) {
    Logger.log (
      d.getFirstMessageSubject() +' : ' + d.getLastMessageDate()
    );
  });
  
  // just get the messages from the last one
  var target = new Date(threads.reduce (function (p,c) {
    // find the newest one
    return p ? 
      Math.max(p,c.getLastMessageDate().getTime()) : 
      c.getLastMessageDate().getTime();
  },0));
  
  // after: takes year/month/day format
  var threads = GmailApp.search(
    'subject:"using the mail service screencast" ' + 
    Utilities.formatString(
      "after:%4d/%02d/%02d", 
      target.getFullYear(),target.getMonth() + 1 , target.getDate()
    )
  );
  Logger.log(threads.length);
  
  // but after: only does it by day.. 
  // so to be more precise, we need to get the messages
  var filteredThreads = threads.filter (function (d) {
    return d.getLastMessageDate().getTime() >= target.getTime();
  });
  Logger.log(filteredThreads.length);
  
  // various tests at thread level
  Logger.log ( 'number of important threads:' + 
    threads.reduce(function(p,c) {
    return c.isImportant() ? p+1 : p;
    },0)
  );
  
  // and at message level
  Logger.log ( 
    'number of starred messages:' + 
    threads.reduce(function(p,c) {
      return p+c.getMessages().reduce (function (m,n) {
        return n.isStarred() ? m+1 : m;
      },0);
    },0)
  );
  
  // threads have ids
  Logger.log (
    GmailApp.getThreadById(threads[0].getId()).getFirstMessageSubject()
  );
  
  // messages have ids
  Logger.log (
    GmailApp.getMessageById(
      threads[0].getMessages()[0].getId()
    )
    .getPlainBody()
  );
  
  // clean up
  GmailApp.search(
    'subject:"using the mail service screencast"'
  )
  .forEach(function(d) {
    d.moveToTrash();
  });
}
