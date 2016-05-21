package com.infiniteskills.utilities;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.junit.Test;

public class DataFileManipulatorTest {

	private DataFileManipulator dfm;
	private int shift = 32;
	private String HOTMAIL = "hotmail";
	private String HOTMAILPWD = "123456789";
	private String GMAIL = "gmail";
	private String GMAILPWD = "987654321";
	private String YAHOO = "yahoo";
	private String YAHOOPWD = "555555555";
	
	@Test
	public void testDataFileManipulator() {
		dfm = new DataFileManipulator(shift);
		assertNotNull("Could not create the dfm", dfm);
	}

	@Test
	public void testWriteReadData() {
		//WARNING: Running this test will delete the current password data files
		//         Make sure you have backed up your files or that you want to run
		//         this test before proceeding.
		
		//set the data
		Map<String, String> mStart = new HashMap<String, String>();
		mStart.put(HOTMAIL, HOTMAILPWD);
		mStart.put(GMAIL, GMAILPWD);
		mStart.put(YAHOO, YAHOOPWD);
		
		dfm = new DataFileManipulator(shift);
		
		//write it:
		dfm.WriteData(mStart);
		
		Map m = dfm.ReadData();
		Iterator<Map.Entry<String, String>> entries = m.entrySet().iterator();
		while(entries.hasNext()){
			Map.Entry<String, String> entry = entries.next();
			String key = (String)entry.getKey();
			String value = (String)entry.getValue();
			if (key.equalsIgnoreCase(HOTMAIL))
			{
				assertEquals("hotmail password was not correctly retrieved", HOTMAILPWD, value);
			}
			else if (key.equalsIgnoreCase(GMAIL))
			{
				assertEquals("gmail password was not correctly retrieved", GMAILPWD, value);
			}
			else if (key.equalsIgnoreCase(YAHOO))
			{
				assertEquals("yahoo password was not correctly retrieved", YAHOOPWD, value);
			}
			else
			{
				fail("data contained in the file was invalid");
			}
		}	
	}
}
