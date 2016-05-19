//IMPORTANT:
//Make your own copy of this project
//Change any email addresses & keys to ones of your own
function deleteCalendar() {
  // delete calendar from previous runs
  CalendarApp.getCalendarsByName(CALENDAR_NAME)
  .forEach(function (d) {
    d.deleteCalendar();
  });
}

