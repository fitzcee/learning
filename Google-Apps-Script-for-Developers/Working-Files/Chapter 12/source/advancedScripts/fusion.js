/**
 * for use with Going Gas videos
 * Advanced Service - Fusion
 * note that this uses the GoingGasLib library
 * key: MwbZ76EQqpFNfqh-XUl5Jxqi_d-phDA33
 */
function fusion() {
// normally I'd use exponential backoff for  operations
  var backoff = GoingGasLib.Utils.expBackoff;
  
  // clean up test fusion table fro previous runs
  deleteTestFiles(TEST_FUSION_TABLE);
  
  // get some test data to play with
  var data = GoingGasLib.SheetUtils.objectifyRange(
    getCarrierDataRange()
  );
  
  // get a handle for fusion table
  // we need a comment here to provoke dialog
  // FusionTables.Table.insert(resource)
  var handle = new GoingGasLib.Fusion (FusionTables);
  
  // create a new fusion table
  // returns a fusion table resource rep.
  var tableId = handle.createTable (
    TEST_FUSION_TABLE, data
  ).tableId;
  
  // add the data
  handle.insertRows (tableId,data);
  
  // query all the data
  Logger.log (handle.query(tableId));
  
   // do a query 
  Logger.log(handle.query (tableId , "carrier = 'BS'").rows);
  
}