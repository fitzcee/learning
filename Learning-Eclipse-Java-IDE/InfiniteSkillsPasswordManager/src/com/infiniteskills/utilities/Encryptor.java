package com.infiniteskills.utilities;

import java.io.*;


public class Encryptor {
	int offset;
	EncryptOptions eo;
	
	//when encrypting, use the password file, write to the data file bin with shift, then delete the password file	
	//when decrypting, use the bin file, decrypt and write to the password file as a new text file
	public Encryptor(int shift, EncryptOptions eopt) {
		offset = shift;
		eo = eopt;
	}
	
	/**
	 * Encrypt or decrypt the file.
	 * @param in the inputstream to read from
	 * @param out the outputstream to write to
	 * @throws IOException if either stream is invalid.
	 */
	public void encryptDecryptStream(InputStream in, OutputStream out) throws IOException
	{
		int next;
		while ((next = in.read()) != -1)
		{
			byte nextByteValue = (byte)next;
			byte output = (byte) (nextByteValue + offset);
			out.write(output);
		}
	}
}
