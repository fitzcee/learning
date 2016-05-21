package com.infiniteskills.gui;

import java.awt.Color;
import java.awt.EventQueue;
import java.util.ArrayList;
import java.util.HashMap;

import javax.swing.JInternalFrame;

import com.infiniteskills.program.Pair;
import com.infiniteskills.program.PasswordCollection;
import com.infiniteskills.program.program;

import java.awt.GridLayout;

import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JLabel;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

public class PasswordDataEditor extends JInternalFrame {
	PasswordCollection pc = null;
	ArrayList<Pair> pwds = null;
	private JTextField txtValue;
	private JTextField txtKey;
	private int currentIndex = 0;
	
	
	private JButton btnSave;
	private JButton btnNew;
	private JButton btnUpdate;
	private JButton btnDelete;
	private JButton btnLast;
	private JButton btnFirst;
	private JButton btnPrev;
	private JButton btnNext;
	private JButton btnCancel;
	private JButton btnSaveChangesTo;
	
	/**
	 * Create the frame.
	 */
	public PasswordDataEditor() {
		getContentPane().setLayout(null);
		
		try
		{
			pc = new PasswordCollection(program.OFFSET);
			pwds = pc.getPasswords(true);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
		if (pwds == null) pwds = new ArrayList<Pair>();
		
		btnNext = new JButton("Next");
		btnNext.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (currentIndex + 1 >= pwds.size())
				{
					currentIndex = 0;
				}
				else
				{
					currentIndex++;
				}
				DisplayItem();
			}
		});
		btnNext.setBounds(235, 85, 73, 23);
		getContentPane().add(btnNext);
		
		txtValue = new JTextField();
		txtValue.setEditable(false);
		txtValue.setBounds(231, 43, 193, 20);
		getContentPane().add(txtValue);
		txtValue.setColumns(10);
		
		txtKey = new JTextField();
		txtKey.setEditable(false);
		txtKey.setColumns(10);
		txtKey.setBounds(14, 43, 193, 20);
		getContentPane().add(txtKey);
		
		btnPrev = new JButton("Prev");
		btnPrev.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (currentIndex -1 < 0)
				{
					currentIndex = pwds.size()-1;
				}
				else
				{
					currentIndex--;
				}
				DisplayItem();
			}
		});
		
		btnPrev.setBounds(152, 85, 73, 23);
		getContentPane().add(btnPrev);
		
		btnFirst = new JButton("First");
		btnFirst.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				currentIndex = 0;
				DisplayItem();
			}
		});
		btnFirst.setBounds(67, 85, 73, 23);
		getContentPane().add(btnFirst);
		
		btnLast = new JButton("Last");
		btnLast.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				currentIndex = pwds.size() - 1;
				DisplayItem();
			}
		});
		btnLast.setBounds(318, 85, 73, 23);
		getContentPane().add(btnLast);
		
		btnDelete = new JButton("Delete");
		btnDelete.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				pwds.remove(currentIndex);
				if (currentIndex -1 < 0)
				{
					currentIndex = 0;
				}
				else
				{
					currentIndex--;
				}
				DisplayItem();
			}
		});
		btnDelete.setBounds(14, 119, 97, 23);
		getContentPane().add(btnDelete);
		
		btnUpdate = new JButton("Update");
		btnUpdate.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				enableEdit(1, true);
			}
		});
		btnUpdate.setBounds(14, 153, 97, 23);
		getContentPane().add(btnUpdate);
		
		btnNew = new JButton("New");
		btnNew.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				currentIndex = -999;
				enableEdit(0, true);
			}
		});
		btnNew.setBounds(14, 187, 97, 23);
		getContentPane().add(btnNew);
		
		btnSave = new JButton("Save");
		btnSave.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//add the item
				Pair p = new Pair(txtKey.getText(), txtValue.getText());
				if (currentIndex == -999)
				{
					pwds.add(p);
					currentIndex = pwds.size() -1;
					JOptionPane.showMessageDialog(null, "Password record was successfully added!");
				}
				else
				{
					pwds.set(currentIndex, p);
					JOptionPane.showMessageDialog(null, "Password record was successfully updated!");
				}
				enableEdit(1, false);
				DisplayItem();
			}
		});
		
		btnSave.setBounds(138, 153, 97, 23);
		getContentPane().add(btnSave);
		
		btnCancel = new JButton("Cancel");
		btnCancel.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				enableEdit(1, false);
				if (currentIndex < 0) currentIndex = 0;
				DisplayItem();
			}
		});
		btnCancel.setBounds(257, 153, 97, 23);
		getContentPane().add(btnCancel);
		
		btnSaveChangesTo = new JButton("Save Changes to File");
		btnSaveChangesTo.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				pc.savePasswords(pwds);
				JOptionPane.showMessageDialog(null, "Password file successfully updated!");
				enableEdit(1, false);
			}
		});
		btnSaveChangesTo.setBounds(138, 216, 216, 23);
		getContentPane().add(btnSaveChangesTo);
		
		setBackground(Color.WHITE);
		setClosable(true);
		setMaximizable(true);
		setResizable(true);
		
		currentIndex = 0;
		DisplayItem();
		enableEdit(1, false);
		
		//pack and show:
		pack();
		setVisible(true);
	}
	
	private void DisplayItem()
	{
		try
		{
			Pair p = pwds.get(currentIndex);
			txtKey.setText(p.getFirstObject().toString());
			txtValue.setText(p.getSecondObject().toString());
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}
	
	private void enableEdit(int option, boolean enabled)
	{
		if (option == 0)
		{
			//add new
			txtKey.setText("");
			txtValue.setText("");
		}
		
		//disable all the buttons/enable the text edit
		txtKey.setEditable(enabled);
		txtValue.setEditable(enabled);
		
		btnFirst.setEnabled(!enabled);
		btnNext.setEnabled(!enabled);
		btnPrev.setEnabled(!enabled);
		btnLast.setEnabled(!enabled);
		
		btnNew.setEnabled(!enabled);
		btnUpdate.setEnabled(!enabled);
		btnDelete.setEnabled(!enabled);
		
		btnSave.setEnabled(enabled);
		btnCancel.setEnabled(enabled);
	}
}
