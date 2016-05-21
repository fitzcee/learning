package com.infiniteskills.gui;

import java.awt.*;
import java.awt.event.*;
import java.util.Iterator;
import java.util.Map;

import javax.swing.*;
import javax.swing.border.EmptyBorder;

import com.infiniteskills.program.*;

public class PasswordManager extends JFrame {
	private static final long serialVersionUID = 1L;
	JPanel contentPane = null;
	JDesktopPane desktopPane = null;
	private PasswordCollection pm = null;
	private JInternalFrame jifPasswordDataEditor;
	
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
		
		//exit
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
		
		//Passwords
		JMenu mnPasswords = new JMenu("Passwords");
		mb.add(mnPasswords);
		
		//Get the current passwords and display them.
		JMenuItem mntmPwdItems = new JMenuItem("Password Data");
		
		mntmPwdItems.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				jifPasswordDataEditor = new PasswordDataEditor();
				jifPasswordDataEditor.setBounds(0, 0, program.WIDTH, program.HEIGHT);
				desktopPane.add(jifPasswordDataEditor);
			}
		});
		mnPasswords.add(mntmPwdItems);
		
		setBackground(Color.WHITE);
		setResizable(false);
		
		//pack and show:
		pack();
		setVisible(true);
	}
}
