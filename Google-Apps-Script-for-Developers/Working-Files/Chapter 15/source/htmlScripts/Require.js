/*
* this is called from the index.html
* its purpose is to include all teh source code needed
* for the html app
* it can include both .html files and .gs files
* I write both server and client side js as a .gs file
* except for the main.js which executes only client side
*/
/**
* given an array of .html file names, it will get the source and return them concatenated for insertion into htmlservice
* like this you can share the same code between client and server side, and use the Apps Script IDE to manage your js code
* @param {string[]} scripts the names of all the scripts needed
* @return {string} the code inside script tags
*/
function requireJs (scripts) {
    return '<script>\n' + scripts.map (function (d) {
        return HtmlService.createHtmlOutputFromFile(d+".js").getContent();
    })
    .join('\n\n') + '</script>\n';
}


/**
* given an array of .gs file names, it will get the source and return them concatenated for insertion into htmlservice
* like this you can share the same code between client and server side, and use the Apps Script IDE to manage your js code
* @param {string[]} scripts the names of all the scripts needed
* @return {string} the code inside script tags
*/
function requireGs (scripts) {
    return '<script>\n' + scripts.map (function (d) {
        return ScriptApp.getResource(d).getDataAsString();
    })
    .join('\n\n') + '</script>\n';
}

