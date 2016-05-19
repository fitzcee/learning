//IMPORTANT:
//Make your own copy of this project
//Change any email addresses & keys to ones of your own
var CALENDAR_NAME = 'going gas calendar';
/**
 * example for Calendar major classes
 * @return {Calendar} the created calendar
 */
function classes() {
  
  // clean up from previous run
  deleteCalendar();
  
  // make a special calendar for the lesson
  // Calendar Class
  var calendar = CalendarApp.createCalendar(CALENDAR_NAME, {
    summary:"A calendar to play around with in the calendar screencast",
    color:CalendarApp.Color.GREEN
  });
  
  // make a new event
  // CalendarEvent Class
  var event = calendar.createEvent(
    'Book to printers',
    new Date('February 5, 2016 13:00:00 UTC'),
    new Date('February 5, 2016 14:00:00 UTC'), {
      guests:'bruce@mcpher.com,bruce.mcpherson@gmail.com',
      sendInvites:true
    });
  
  // get the guests
  // EventGuest class
  
  var guests = event.getGuestList();
  guests.forEach(function(d) {
    Logger.log (
      d.getEmail() + ':' + d.getName() + ':' + d.getGuestStatus()
    );
  });
  
  // event recurrence and recurrence rule
  var eventRecurrence = CalendarApp.newRecurrence()
    .addWeeklyRule()
    .onlyOnWeekdays([CalendarApp.Weekday.FRIDAY])
    .until(new Date('January 6, 2017'));
  
  // EventSeries class
  var eventSeries = calendar.createEventSeries(
    'Review sales',
    new Date('March 4, 2016 13:00:00 UTC'),
    new Date('March 4, 2016 14:00:00 UTC'),
    eventRecurrence, {
      location:'my house',
      sendInvites:true,
      guests:guests.map(function(d) {
        return d.getEmail();
      }).join(",")
    });
  
    return calendar;
}
