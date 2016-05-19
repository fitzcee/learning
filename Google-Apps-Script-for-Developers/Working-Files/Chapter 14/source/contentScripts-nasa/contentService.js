/**
* For use with Going gas videos
* APIS
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/

function test () {
  var list = NasaSat.getList({
    address:"1600 Amphitheatre Parkway,Mountain View, CA 94043"
  });
  Logger.log(list);
}
var NasaSat = (function (ns) {
  
  ns.getSpread = function (start, finish, nobs) {
  
    // spread the list between two dates
    // across a period of time
    var period = (finish - start + 1)/nobs;
    var obs = [];
    for (var i=start; i < finish ;i+=period ) {
      obs.push (i);
    }
    return obs;
  };
  
  ns.getTargets = function (list, obs) {
    return obs.reverse().map (function (d) {
      return list.filter(function(e) {
        return e < d; 
      })[0];
    }).reverse();
  } 

  /**
   * code and get list
   * @param {object} parameter the webapp.parameter object
   * @return {[object]} the results
   */
  ns.getList = function (parameter) {
    
    // geocode if necessary
    var pos =  ns.getPos (parameter);
    
    // get the lists
    return {
      list:pos ? ns.list (pos) : [],
      address:parameter.address,
      pos:pos
    }; 

  };
  /**
   * either use the maps api
   * or the provided lat/lng
   * @param {object} parameter the webapp.parameter object
   * @return {object} the results
   */
  ns.getPos = function (parameter) {
    
    // either use the give lat/lng
    // or geocode
    var pos = parameter;
    if (!pos.lat || !pos.lng) {
      var coded = Maps
      .newGeocoder()
      .geocode(parameter.adress);
      

      pos = coded.results && coded.results.length ? 
        coded.results[0].geometry.location : null;
    }
    
    // check that we have something
    return pos;
  };
  

  /**
  * gets a list of all dates that sat passed over
  * @param {object} pos lat/lng
  * @return {[object]} the results
  */
  ns.list = function (pos) {
    
    // get the api keys
    var api= Fetcher.getApi('nasa');
    
    // get dates of each known image
    var response = UrlFetchApp.fetch(
      api.baseUrl + 
      'planetary/earth/assets?api_key=' + api.key + 
      '&lon=' + pos.lng +
      '&lat=' + pos.lat 
    );
    
    // get the result
    return JSON.parse ( response.getContentText() );
    
  };
  
  
  return ns;
}) (NasaSat || {});
