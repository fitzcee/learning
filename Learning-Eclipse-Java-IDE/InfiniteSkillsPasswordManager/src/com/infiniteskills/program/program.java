package com.infiniteskills.program;
import java.awt.EventQueue;
import java.io.File;

import javax.swing.JFrame;
import javax.swing.JPanel;

import com.infiniteskills.gui.*;

/**
 * Program to run the password manager application.
 * @author Infinite Skills
 *
 */
public class program {

	public static final int WIDTH = 650;
	public static final int HEIGHT = 500;
	public static final String dataFilePath = "G:\\DevArena\\EclipseKepler\\InfiniteSkillsPasswordManager\\passworddata.bin";
	public static final String passwordFilePath = "G:\\DevArena\\EclipseKepler\\InfiniteSkillsPasswordManager\\passwords.txt";
	public static final int OFFSET = 32;
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					//make sure the files exist:
					try{
						File f1 = new File(dataFilePath);
						File f2 = new File(passwordFilePath);
						if (!f1.exists()){
							f1.createNewFile();
						}
						if (!f2.exists()){
							f2.createNewFile();
						}
					}
					catch(Exception ex)
					{
						ex.printStackTrace();
					}
					
					PasswordManager pm = new PasswordManager();
					pm.setLocation(150,25);
					pm.setSize(WIDTH +20,HEIGHT+60);
					pm.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
					
					JPanel panel = new JPanel();
					panel.setBounds(0, 0, 600, 600);
					pm.getContentPane().add(panel);
					pm.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

}
