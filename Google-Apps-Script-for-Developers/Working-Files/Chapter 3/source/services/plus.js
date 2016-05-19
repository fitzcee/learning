function plus() {
  
  // first the api needs to be enabled
  
  // now we can use it. 
  var posts = Plus.Activities.list('me','public', { 
    maxResults:5
  });
  
  //Logger.log(posts);
  
  // log some info from each post
  posts.items.forEach (function (d) {
    Logger.log(d.actor.displayName + ':' + d.title);
  });
}
