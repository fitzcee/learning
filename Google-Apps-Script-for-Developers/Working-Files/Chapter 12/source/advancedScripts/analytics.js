/**
 * for use with Going Gas videos
 * Advanced services - Analytics
 * note that this uses the GoingGasLib library
 * key: MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
 */
function analytics () {
  
  // normally I'd use exponential backoff for  operations
  var backoff = GoingGasLib.Utils.expBackoff;
  
  // clean up test sheets
   deleteTestSheets();
  
 // get all the accounts
  var accounts = backoff (function () {
    return Analytics.Management.Accounts.list();
  }).items
  
    // combine with the properties
  .reduce (function (list,account) {
    
    // get the web properties associated with each account
    backoff (function () {
      return Analytics.Management.Webproperties.list(
        account.id
      );
    }).items
    
    .forEach (function(webProperty) {
      
      backoff (function () {
        return Analytics.Management.Profiles.list(
          webProperty.accountId , webProperty.id
        )
      }).items
      
      .forEach (function(profile) {
        list.push ({
          accountId:account.id,
          name:webProperty.name,
          propertyId:webProperty.id,
          profileId:profile.id
        });
      });
    });
    
    return list;
    
  },[]);
  
    // write it all to a spreadsheet
  var range = createTestRange([
    'profiles',
    'ramblings'
  ]);
  
  // using gaslib functions to convert and write data
  GoingGasLib.SheetUtils
  .objectsToRange( redact (accounts) , range);
  
  // and color the heading row
  GoingGasLib.SheetUtils.rangeFill (
    range.offset(0,0,1,range.getSheet().getLastColumn()), 
    'backgrounds',
    'yellow'
  ); 
  
  // the profile ID is the one to use to find the analytics 
  // Im going to get a specific one
  var profileId = accounts.filter (function (d) {
    return d.name === "Ramblings.mcpher.com";
  })[0].profileId;
  
  // now get some analytics stats
  var pageViews = backoff (function () {
    return Analytics.Data.Ga.get (
      'ga:' + profileId ,
      GoingGasLib.Utils.gaDate(new Date (2010,0,1)),
      GoingGasLib.Utils.gaDate(new Date ()),
        'ga:pageViews',{
          dimensions:'ga:country' 
        }
    );
  });
  // get the column headers
  var index = 0;
  var headers= pageViews.columnHeaders.reduce(function(p,c){
    p[c.name.replace("ga:","")] = index++;
    return p;
  },{});
  
  // turn data into an array of objects 
  var viewData = GoingGasLib.SheetUtils.objectifyData (
    headers, pageViews.rows 
  )
  // sort it in reverse
  .sort (function (a,b) {
    return b.pageViews - a.pageViews; 
  });
  
  // write all that to a sheet
  var range = getTestRange ('ramblings');
  
  // clear the sheet
  range.getSheet().clear();
  
  // write the data
  GoingGasLib.SheetUtils
  .objectsToRange( viewData , range);
  
  // and  color the heading row
  GoingGasLib.SheetUtils.rangeFill (
    range.offset(0,0,1,range.getSheet().getLastColumn()), 
    'backgrounds',
    'yellow'
  ); 
}

/**
* since properties are private, im redacting some data for the example
* for your own then just set hide to false
*/
function redact(props) {
  // set this to false for your own data
  var HIDE = true;
  return HIDE ? 
    props.map(function(row) {
      return Object.keys(row).reduce(function(p,c) {
        p[c] = row[c].slice(0,1)+
          row[c].slice(1,row[c].length-1).replace(/./g, '-') +
            row[c].slice(-1);
        return p;
      },{})
    }) : props;
}
