/**
* For use with Going gas videos
* APIS
* Service accounts
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/
function setDefaults () {
  /**
  * default properties for this lesson
  */
  return Fetcher.setApi ('nasa' , {
    "key":"DEMO_KEY",
    "baseUrl":"https://api.nasa.gov/"
  });
  
}
