/**
* For use with Going gas videos
* APIS
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/

/**
 * will be called to provide test parameter values if none are
 * provided
 * @param {object} e the doGet argument
 * return {object} the test parameters
 */
function getTestParameters(e) {
  
  e = e || {};
  e.parameter = e.parameter || {};
  e.parameter.id = e.parameter.id || 
    "1TxZ9Ut5VIOpJF_Zf2KwFtbup4RWCV_8rsCBz4Gkv6SU";
  e.parameter.sheet = e.parameter.sheet || 
    "carriers";
  
  return e;
}

