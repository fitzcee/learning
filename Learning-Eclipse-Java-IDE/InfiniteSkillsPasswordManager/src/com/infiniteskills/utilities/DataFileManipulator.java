package com.infiniteskills.utilities;
import com.infiniteskills.program.*;
import com.json.parsers.JSONParser;
import com.json.parsers.JsonParserFactory;

import java.io.*;
import java.util.*;

/**
 * Encrypt and save the file or Decrypt and Read the file.
 * @author Brian
 */
public class DataFileManipulator {
	private int offset;
	//program.dataFilePath;
	File f;
	
	/**
	 * Set up the manipulator to encrypt or decrypt
	 * @param shift the shift to encrypt or decrypt by
	 * @param eo the encrypt/decrypt operation type
	 */
	public DataFileManipulator(int shift)
	{
		offset = shift;
	}
	
	/**
	 * Encrypt or Decrypt the file
	 * @param eo
	 */
	private void EncryptDecryptFile(EncryptOptions eo){
		int realOffset = offset;
		String inFile = program.passwordFilePath;
		String outFile = program.dataFilePath;
		Encryptor enc = new Encryptor(offset, eo);
		
		if (eo == EncryptOptions.DECRYPT)
		{
			realOffset = offset*-1;
			enc = new Encryptor(realOffset, eo);
			inFile = program.dataFilePath;
			outFile = program.passwordFilePath;
		}
		
		try
		{
			FileInputStream in = new FileInputStream(inFile);
			FileOutputStream out = new FileOutputStream(outFile);
			enc.encryptDecryptStream(in, out);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}
	
	/**
	 * Open the encrypted password data file, decrypt to plain text
	 * 	then read the plain text to a map in memory and delete the plain text file.
	 * @return a map of keys/values for password data.
	 */
	public Map ReadData()
	{
		Map hm = new HashMap();
		
		//decrypt the data file to a temp password file
		EncryptDecryptFile(EncryptOptions.DECRYPT);
		
		//open and read the file into the map
		BufferedReader br = null;
		try{
			br = new BufferedReader(new FileReader(program.passwordFilePath));
			
			StringBuilder sb = new StringBuilder();
			String inline;
			while((inline = br.readLine()) != null){
				sb.append(inline);
			}
			
			//this will not work until the jar has been added for quick-json-1.0.2.3
			JsonParserFactory factory = JsonParserFactory.getInstance();
			JSONParser p = factory.newJsonParser();
			hm = p.parseJson(sb.toString());
		}
		catch (IOException ioex){
			ioex.printStackTrace();
		}
		finally
		{
			try{
				if (br!= null){
					br.close();
				}
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		//delete the password text file [everything is in memory now]
		clearPasswordFile();
		
		//return the map from the file
		return hm;
	}
	
	/**
	 * Write the keys and values to the password file, then encrypt the data to 
	 * 	an encrypted file and delete the plain text file.
	 * @param m
	 */
	public void WriteData(Map<String, String> m)
	{
		//create the json string for the data
		StringBuilder sb = new StringBuilder();
		sb.append("{\n");
		
		//write each entry into the password file
		Iterator<Map.Entry<String, String>> entries = m.entrySet().iterator();
		while(entries.hasNext()){
			Map.Entry<String, String> entry = entries.next();
			String key = (String)entry.getKey();
			String value = (String)entry.getValue();
			String nextJSON = String.format("\t\"%s\":\"%s\",\n"
								, key
								, value);
			sb.append(nextJSON);
		}
		
		sb.append("}\n");
		
		//write to the password file for encryption
		FileWriter fw = null;
		try
		{
			fw = new FileWriter(program.passwordFilePath);
			fw.write(sb.toString());
		}
		catch (IOException ioex)
		{
			ioex.printStackTrace();
		}
		finally
		{
			try
			{
				if (fw != null) fw.close();
			}
			catch (Exception ex)
			{
				ex.printStackTrace();
			}
			sb = null;
		}
		
		//encrypt the file to binary storage file [will delete the password file]
		EncryptDecryptFile(EncryptOptions.ENCRYPT);
		
		//clear the password text file [everything is in bin file encrypted now]
		clearPasswordFile();
	}
	
	/**
	 * Clear the password file.
	 */
	private void clearPasswordFile()
	{
		FileWriter fw = null;
		try
		{
			fw = new FileWriter(program.passwordFilePath);
			fw.write("data has been encrypted");
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
		finally
		{
			try
			{
				if (fw != null) fw.close();
			}
			catch (Exception ex)
			{
				ex.printStackTrace();
			}
		}
	}
	
}
