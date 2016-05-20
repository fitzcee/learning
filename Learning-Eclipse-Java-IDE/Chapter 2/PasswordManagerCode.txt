package com.infiniteskills.gui;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

import com.infiniteskills.program.*;

public class PasswordManager extends JFrame {
	private static final long serialVersionUID = 1L;
	JPanel contentPane = null;
	JDesktopPane desktopPane = null;

	/**
	 * Create the frame.
	 */
	public PasswordManager() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		getContentPane().setLayout(null);
		
		desktopPane = new JDesktopPane();
		desktopPane.setBounds(0, 0, program.WIDTH, program.HEIGHT);
		getContentPane().add(desktopPane);
		
		JMenuBar mb = new JMenuBar();
		setJMenuBar(mb);
		
		JMenu mnFile = new JMenu("File");
		mb.add(mnFile);
		
		JMenuItem mntmExit = new JMenuItem("Exit");
		mntmExit.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				//exit
				int close = JOptionPane.showConfirmDialog(null
									, "Are you sure you want to exit?"
									, "End Application?"
									, JOptionPane.YES_NO_OPTION
									, JOptionPane.INFORMATION_MESSAGE);
				if (close == 1) return;
				System.exit(0);
			}
		});
		mnFile.add(mntmExit);
		
		JMenu mnPasswords = new JMenu("Passwords");
		mb.add(mnPasswords);
		
		JMenuItem mntmPwdItems = new JMenuItem("Get");
		mntmPwdItems.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {

				//do something
			}
		});
		mnPasswords.add(mntmPwdItems);
	}
}
