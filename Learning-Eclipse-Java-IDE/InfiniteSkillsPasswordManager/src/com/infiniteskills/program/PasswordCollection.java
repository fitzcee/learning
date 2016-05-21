package com.infiniteskills.program;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.infiniteskills.utilities.DataFileManipulator;

/**
 * PasswordCollection holds the map of passwords and interacts with the DFM to get the data
 * 	from the encrypted file.
 * @author Brian
 *    WARNING: This file does not have unit tests associated at this time.
 */
public class PasswordCollection {
	private HashMap<String, String> hm;
	private int offset;
	
	/**
	 * Construct a PasswordCollection object.
	 * @param shift the encryption offset supplied by the user.
	 */
	public PasswordCollection(int shift){
		hm = null;
		offset = shift;
	}
	
	/**
	 * Load the passwords from the encrypted file.
	 */
	private void loadPasswords()
	{
		//Open the data file  and get the password k/v data
		DataFileManipulator dfm = new DataFileManipulator(offset);
		hm = (HashMap<String, String>) dfm.ReadData();
	}
	
	/**
	 * Get the collection of password k/v data in a list of Pair.
	 * @param forceRead force the data to be re-read from the encrypted file.
	 * @return the current map stored in memory for the password collection
	 */
	public ArrayList<Pair> getPasswords(boolean forceRead) {
		if (forceRead || hm == null || hm.size() == 0)
		{
			loadPasswords();
		}
		
		ArrayList<Pair> pwds = new ArrayList<Pair>();
		Iterator<Map.Entry<String, String>> entries = hm.entrySet().iterator();
		while(entries.hasNext()){
			Map.Entry<String, String> entry = entries.next();
			String key = (String)entry.getKey();
			String value = (String)entry.getValue();
			
			Pair p = new Pair(key, value);
			pwds.add(p);
		}
		return pwds;
	}
	
	/**
	 * Allow changes to be saved to file.
	 * @param pwds the current state of pwds.
	 */
	public void savePasswords(ArrayList<Pair> pwds){
		HashMap hm = new HashMap();
		for (Pair p : pwds)
		{
			hm.put(p.getFirstObject().toString(), p.getSecondObject().toString());
		}
		DataFileManipulator dfm = new DataFileManipulator(offset);
		dfm.WriteData(hm);
	}
}
