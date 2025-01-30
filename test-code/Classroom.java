package model;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;


public class Classroom {
	private ArrayList<UserAccount> users;
	private Gender gender;
	private Career career;
	public final static String SAVE_PATH_FILE = "data/userData.ap2";

	
	public ArrayList<UserAccount> getUsers() {
		return users;
	}

	public void setUsers(ArrayList<UserAccount> users) {
		this.users = users;
	}

	public Classroom(ArrayList<UserAccount> users) {
		this.users = users;
	}
	
	public Classroom() {
		users= new ArrayList<>();
		
	}
	
	public void createUser(String username, String password, File photo, LocalDate date, String genderS, String careerS,String browser)throws IOException {
	    gender= Gender.valueOf(genderS.toUpperCase());
		career= Career.valueOf(careerS.toUpperCase());
		users.add(new UserAccount( username,  password,  photo,  date,  gender,  career, browser) );
		saveData();
		
	}
	
	
	public boolean signIn(String username, String password) {
		boolean singin=false;
		
		for(int c=0; c<users.size();c++) {
			if(username.equals(users.get(c).getUsername())) {
				if(password.equals(users.get(c).getPassword())) {
					singin=true;
				}
				
			}
			
		}
		return singin;
	}
	
	
	public int signInC(String username, String password) {
		int x=0;
		
		for(int c=0; c<users.size();c++) {
			if(username.equals(users.get(c).getUsername())) {
				if(password.equals(users.get(c).getPassword())) {
					x=c;
				}
				
			}
			
		}
		return x;
	}
	
	public UserAccount getUser(int c) {
		return users.get(c);
	}
	
	public boolean empty() {
		return users.isEmpty();
	}

	public void saveData() throws IOException{
		ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(SAVE_PATH_FILE));
		oos.writeObject(users);
		oos.close();
	}
	
	@SuppressWarnings("unchecked")
	public boolean loadData() throws IOException, ClassNotFoundException{
	    File f = new File(SAVE_PATH_FILE);
	    boolean loaded = false;
	    if(f.exists()){
	      ObjectInputStream ois = new ObjectInputStream(new FileInputStream(f));
	      users = (ArrayList<UserAccount>)ois.readObject();
	      ois.close();
	      loaded = true;
	    }
	    return loaded;
	  }


}
