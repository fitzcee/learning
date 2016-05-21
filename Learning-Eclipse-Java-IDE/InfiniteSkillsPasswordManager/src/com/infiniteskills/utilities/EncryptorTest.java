package com.infiniteskills.utilities;

import static org.junit.Assert.*;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.junit.Test;

import com.infiniteskills.program.program;
import com.json.parsers.JSONParser;
import com.json.parsers.JsonParserFactory;

public class EncryptorTest {
	private int shift = 32;
	
	@Test
	public void testConstructor() {
		Encryptor e = new Encryptor(shift, EncryptOptions.DECRYPT);
		assertNotNull("Could not create an encryptor", e);
	}
	
	@Test
	public void testEncryptDecrypt()
	{
		//this test is not very thorough..
		String before;
		String pFile = program.passwordFilePath;
		String epFile = program.dataFilePath;
		
		//open the file and read contents into memory for comparison
		BufferedReader br = null;
		try{
			br = new BufferedReader(new FileReader(pFile));
			
			StringBuilder sb = new StringBuilder();
			String inline;
			while((inline = br.readLine()) != null){
				sb.append(inline);
			}
			
			before = sb.toString();
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
		
		
		//encrypt, then decrypt
		InputStream inStream;
        OutputStream outStream;
        try
        {
            inStream = new FileInputStream(pFile);
            outStream = new FileOutputStream(epFile);
            
            Encryptor e = new Encryptor(shift, EncryptOptions.ENCRYPT);
            e.encryptDecryptStream(inStream, outStream);
            
            inStream.close();
            outStream.close();
        }
        catch(Exception ex)
        {
        	ex.printStackTrace();
        }
        
        
        try{
        	inStream = new FileInputStream(epFile);
            outStream = new FileOutputStream(pFile);
            
            Encryptor e = new Encryptor(shift * -1, EncryptOptions.DECRYPT);
            e.encryptDecryptStream(inStream, outStream);
            
            inStream.close();
            outStream.close();
		}
        catch(Exception ex)
        {
        	ex.printStackTrace();
        }
        
        //open and make sure the file is decrypted
      	try
      	{
  			br = new BufferedReader(new FileReader(pFile));
  			
  			StringBuilder sb = new StringBuilder();
  			String inline;
  			while((inline = br.readLine()) != null){
  				sb.append(inline);
  			}
  			
  			before = sb.toString();
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
	}

	@Test
	public void testEncrypt(){
		String pFile = program.passwordFilePath;
		String epFile = program.dataFilePath;
				
		InputStream inStream;
        OutputStream outStream;
        try
        {
            inStream = new FileInputStream(pFile);
            outStream = new FileOutputStream(epFile);
            
            Encryptor e = new Encryptor(shift, EncryptOptions.ENCRYPT);
            e.encryptDecryptStream(inStream, outStream);
            
            inStream.close();
            outStream.close();
        }
        catch(Exception ex)
        {
        	ex.printStackTrace();
        }		
	}
	
	@Test
	public void testDecrypt() {
		String pFile = program.passwordFilePath;
		String epFile = program.dataFilePath;
				
		InputStream inStream;
        OutputStream outStream;
        try
        {
            inStream = new FileInputStream(epFile);
            outStream = new FileOutputStream(pFile);
            
            Encryptor e = new Encryptor(shift * -1, EncryptOptions.DECRYPT);
            e.encryptDecryptStream(inStream, outStream);
            
            inStream.close();
            outStream.close();
        }
        catch(Exception ex)
        {
        	ex.printStackTrace();
        }	
	}
}
