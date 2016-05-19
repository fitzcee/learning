//IMPORTANT:
//Make your own copy of this project
//Change any email addresses & keys to ones of your own
function events() {

  // create a new calendar using earlier example
  var calendar = classes();
  
  // find all events that match
  var events = calendar.getEvents (
    new Date(2016,0,1),
    new Date(2017,0,1), {
      search:'Book to printers'
    }
  );
  
  // should be 1
  Logger.log(events.length);
  
  // see all the guests who have not responded 
  // to at least one event
  var baddies  = events.reduce (function(list,event) {
  
    // build up an array of guests 
    // who have not replied to some of the events
    event.getGuestList().filter(function(guest) {
      
      // if they haven't reponded this will still be invited
      return guest.getGuestStatus() === CalendarApp.GuestStatus.INVITED;
    })
    
     // only add if we dont already have this guy on the list
    .forEach (function(guest) {
      if (!list.some(function(f) { 
        return f.getEmail() === guest.getEmail(); 
      })) { 
        list.push(guest);
      }
    });
    
    return list;
  },[]);
  
  // here's who hasnt done anything yet
  Logger.log (baddies.map(function(d) {
    return d.getEmail();
  }).join('\n'));
  
  // lets create a few events for today for testing
  var start = new Date().getTime(), 
      finish = start + 1000*60*60*8,
        interval = (finish-start)/4;
  // should create a few throughout the day
  while (start < finish) {
    calendar.createEvent(
      'busy day - another event ' + start,
      new Date(start),
      new Date(start + 1000*60*60), {
        guests:
        'bruce@mcpher.com,bruce.mcpherson@gmail.com,test@mcpher.com',
        sendInvites:true
      }
    );
    start += interval;
  }
  
}

function nonResponding () {
  // get the test calendar
  var calendar = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  
  // get today's events that contain non responding guests 
  var events = calendar.getEventsForDay(new Date(), {
    statusFilters:[CalendarApp.GuestStatus.INVITED]
  });
  
  // should be 1 - but statusFilters does not work
  // subscribe to this issue for when it is fixed
  // https://code.google.com/p/google-apps-script-issues/issues/detail?id=5323
  Logger.log(events.length);
  
  // get todays events
  var events = calendar.getEventsForDay(new Date());
  
   // send a reminder to those who havent responded
  events.forEach(function(event) {
    event.getGuestList().forEach(function(guest) {
      if ([CalendarApp.GuestStatus.INVITED,
           CalendarApp.GuestStatus.MAYBE].some(function(e) {
        return guest.getGuestStatus() === e; })) {
          // it would be nice to get the html link 
          // of the event, but you need advanced service for that
          MailApp.sendEmail({
            to:guest.getEmail(),
            subject:event.getTitle(),
            body:'We have a meeting today at ' + 
              Utilities.formatDate(
               event.getStartTime(), calendar.getTimeZone(), "hh:mm"
              ) +
              '\nPlease go to your calendar ' + 
              'and confirm whether you are coming'
          });
      }
    });
  });
  
  
}

function agenda () {
  // get the test calendar
  var calendar = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  
  // get todays events
  var events = calendar.getEventsForDay(new Date());
  
  // send a summary of today to myself
  MailApp.sendEmail( {
    to:'bruce@mcpher.com', 
    subject:'Events for ' + 
      Utilities.formatDate(
       new Date(), calendar.getTimeZone(), "dd-MMM-YYYY"
      ),
    htmlBody: events.map(function(e) {
      return [
        Utilities.formatDate(
         e.getStartTime(), calendar.getTimeZone(), "hh:mm"
        ) + '-',
        Utilities.formatDate(
         e.getEndTime(), calendar.getTimeZone(), "hh:mm"
        ),
        e.getTitle(),
        e.getGuestList().map(function(d) {
          return d.getEmail() + ':' + d.getGuestStatus()
        }).join('<br>')
      ];
    })
    
    .reduce (function (html,rows) {
        return html+rows.reduce (function(rowHtml,td) {
          return rowHtml + '<td>' + td + '</td>';
        },'<tr>') + '</tr>'
    },'<h2>' + calendar.getDescription() + '</h2>' + 
    '<table><tr><th>start</th><th>finish</th>' + 
    '<th>title</th><th>guests</th></tr>') + 
    '</table>'
  });
}