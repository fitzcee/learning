/**
* For use with Going gas videos
* HtmlService and Addons
* official advice is not to use libraries in add-ons
* so you can copy the library locally if you want
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/

/**
 * setting up an add-on
 * I always out this stuff in a script called Addon.
 * 1. create a function that kicks off the work
 * 2. create an open function that references it 
 * and adds to the add on menu
 * 3. create an onInstall function that calls onOpen
 * 
 */

/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Show airport map', 'showMap')
      .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Opens a sidebar. 
 */
function showMap() {

  var ui = HtmlService.createTemplateFromFile('index.html')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Airport map');
  
  SpreadsheetApp.getUi().showSidebar(ui);
}
