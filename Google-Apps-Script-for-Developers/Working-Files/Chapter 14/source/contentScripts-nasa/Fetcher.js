/**
* For use with Going gas videos
* APIS
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/
var Fetcher = (function (ns) {
  /**
   * get api info
   * @param {string} apiName teh api name the key is stored under
   * @return {object} the key and the baseUrl
   */
  ns.getApi = function (apiName) {
    var store = PropertiesService.getScriptProperties();
    var data = GoingGasLib.Utils.expBackoff( function () {
      return store.getProperty(apiName);
    });
    return data ? JSON.parse(data) : null;
  };
  
  /**
   * get api info
   * @param {string} apiName teh api name the key is stored under
   * @param {object} value the object to set
   * @return {object} the key and the baseUrl
   */
  ns.setApi = function (apiName, value) {
    var store = PropertiesService.getScriptProperties();
    GoingGasLib.Utils.expBackoff( function () {
      store.setProperty(apiName, JSON.stringify(value))
    });
    return value;
  };
  
  return ns;
  
})(Fetcher || {});

