/**
* For use with Going gas videos
* Authorization and authentication
* Service accounts
* needs cGoa library
* MZx5DzNPsYjVyZaR67xXJQai_d-phDA33
* details here
* http://ramblings.mcpher.com/Home/excelquirks/goa
* also uses GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
* to simplify acccess to data store - uses
* cDbabstraction
* MHfCjPQlweartW45xYs6hFai_d-phDA33
* cDdriverDataStore
* MPZF_EC6nOZFAjMRqCxEaUyz3TLx7pV4j
* details here
* http://ramblings.mcpher.com/Home/excelquirks/dbabstraction/driverdbabstraction
*/

//https://drive.google.com/a/mcpher.com/file/d/0B92ExLh4POiZaVYzWjhxRG5HS00/view?usp=sharing
/**
* this stores the credentials for the service in properties
* it should be run once, then deleted
*/
function oneOffStore () {
  var propertyStore = PropertiesService.getScriptProperties();
  cGoa.GoaApp.setPackage (
    propertyStore , 
    cGoa.GoaApp.createServiceAccount (DriveApp , {
      packageName: 'servicescripts',
      fileId:'0B92ExLh4POiZaVYzWjhxRG5HS00',
      scopes : cGoa.GoaApp.scopesGoogleExpand ([
        'datastore',
        'userinfo.email'
      ]),
    service:'google_service'
  }));;
  
}
/**
 * test authentication using dbabstraction
 */
function dataStoreSA (params) {
       
  // pick up the token refreshing if necessary
  var goa = cGoa.GoaApp.createGoa(
    'servicescripts', 
    PropertiesService.getScriptProperties()
  )
  .execute(params);
  
  if (!goa.hasToken()) {
    throw 'no token retrieved';
  }
  
  // do a test - passing the token and any parameters that arrived to this function
  Logger.log (
    testDataStore (goa.getToken(), goa.getParams(params) )
  );
  
} 

/**
 * this is your main processing - will be called with your access token
 * @param {string} accessToken - the accessToken
 * @param {*} params any params
 */
function testDataStore (accessToken,params) {
  // to simplify things
  // im using dbabstractino drivers
  // to construct requeest to data store
  // as the structure is complicated
  var handle = new cDbAbstraction.DbAbstraction(cDriverDataStore, {
    siloid:'carriers',
    dbid:'xliberationgplus',
    accesstoken:accessToken
  });
  if (!handle.isHappy()) {
    throw 'no data store available';
  }
  
  // delete anything currently there
  var result = handle.remove();
  if (result.handleCode < 0) {
    throw JSON.stringify(result);
  }
  
  // add some test data retrieved from spreadsheet
  var data = GoingGasLib.SheetUtils.objectifyRange(
    getCarrierDataRange()
  );
  
  var result = handle.save(data);
  if (result.handleCode < 0) {
    throw JSON.stringify(result);
  }
  
  // retrieve it 
  var result = handle.query();
  if (result.handleCode < 0) {
    throw JSON.stringify(result);
  }
  
  return result.data;

}

