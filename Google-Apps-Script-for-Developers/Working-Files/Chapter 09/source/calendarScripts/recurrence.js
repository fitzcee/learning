function recurrence() {
  // get a fresh test calendar with some events
  var calendar = classes();
  
  // get all events
  var events = calendar.getEvents (
    new Date(2016,0,1),
    new Date(2017,0,1)
  );

 // make a list of different recurring events
  // make a list of different recurring events
  var eventSeriess = events.reduce(function (list, event) {
    
    if (event.isRecurringEvent()) {
      
      // belongs to an event series
      var series = event.getEventSeries();

      // actually, series ID === event ID
      // and each event has the same ID
      //Logger.log (
      //  '\nevent :' + event.getId() + '\nseries:' + series.getId()
      //);

      // if its a new eventseries, remember it     
      if (!list.some(function(d) {
        return series.getId() === d.getId();})) { 
          list.push(series);
      }
    }

    return list;
  },[]);
  
  // how series many are there?
  Logger.log(eventSeriess.length);
  
  // add a guest to one of the events
  // find the closest after 4th July
  var target = new Date(2016,6,4).getTime();
  
  // you can get an eventseries by its id
  var eventSeries = calendar.getEventSeriesById (
    eventSeriess[0].getId()
  );
  
  // but i need to look at the individual events of that series
  // and i cant get them except by searching
  // also the recurrence data is not gettable
  var nearestEvent = events.filter(function(d){
    return d.getId() === eventSeries.getId() &&
      d.getStartTime().getTime() > target;
  })
  
    // sort it - i think it should already be but do it anyways
  .sort (function (a,b) {
    return a.getStartTime().getTime() - 
      b.getStartTime().getTime();
  })[0];
  
   // now invite somebody
  if (!nearestEvent) {
    throw 'did not find a recurring event after ' + 
      target.toString();
  }
  
  // add extra guests and extend the meeting time
  nearestEvent.addGuest('theboss@mcpher.com')
  .setTime(
    nearestEvent.getStartTime(), 
    new Date (
      nearestEvent.getEndTime().getTime() + 1000 * 60 *60 
    )
  )
  .setTitle(
    nearestEvent.getTitle() + 
    ' (special post holiday extended meeting)'
  );
  // however it doesnt send an email to the new guest
  // i would need to make it 
  // a new event, send an email directly, 
  // or used the advanced service
  
  Logger.log(events.filter(function(event) {
    return event.isRecurringEvent(); 
  }).length + ' / ' + events.length);
  
  // get all events
  var events = calendar.getEvents (
    new Date(2016,0,1),
    new Date(2017,0,1)
  );
  
   // has that changed the eventseries?
  var eventSeriess = events.reduce(function (list, event) {
    
    if (event.isRecurringEvent()) {
      
      // belongs to an event series
      var series = event.getEventSeries();

      // actually, series ID === event ID
      // and each event has the same ID
      Logger.log (
        '\nevent :' + event.getId() + 
        '\nseries:' + series.getId() + 
        '\nguests:' + event.getGuestList().length
      );

      // if its a new eventseries, remember it     
      if (!list.some(function(d) {
        return series.getId() === d.getId();})) { 
          list.push(series);
      }
    }

    return list;
  },[]);
    
  // how  many series are there? - still 1
  Logger.log(eventSeriess.length);
  
  // guest list - still the original
  Logger.log(
    eventSeriess[0].getGuestList().map(function(d) {
      return d.getEmail();
    })
    .join('\n'));
}