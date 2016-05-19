/*
* For use with Going gas videos
* HtmlService and Addons
* official advice is not to use libraries in add-ons
* so you can copy the library locally if you want
* needs GoingGasLib
* MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
*/

/*
* best to create in this order
* do the Addon setup in Addon.gs
* -- the html & css
* create the index.html
* create the styles.html
* -- utility function
* copy in the require script
* copy in the CORS script
* -- the pure client side js
* write the main.js
* -- the client side js
* write App.gs
* write Render.gs
* write Client.gs
* -- the server side script
* write Server.gs
*
* run onOpen - to authorize
* you should get an error since there is no sheet associated yet
*
* now test as addon from the publish menu
* associate with large airports data sheet
*/
