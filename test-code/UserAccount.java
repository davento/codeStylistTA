package model;
import java.io.File;
import java.io.Serializable;
import java.time.LocalDate;


public class UserAccount implements Serializable {
	public final static long serialVersionUID = 1;

	private String username;
	
	private String password;
	
	private File photo;
	
	private LocalDate date;
	
	private Gender gender;
	
	private Career career;
	
	private String browser;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public File getPhoto() {
		return photo;
	}

	public void setPhoto(File photo) {
		this.photo = photo;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public Career getCareer() {
		return career;
	}

	public void setCareer(Career career) {
		this.career = career;
	}

	public String getBrowser() {
		return browser;
	}

	public void setBrowser(String browser) {
		this.browser = browser;
	}

	public UserAccount(String username, String password, File photo, LocalDate date, Gender gender, Career career,String browser) {
		this.username = username;
		this.password = password;
		this.photo = photo;
		this.date = date;
		this.gender = gender;
		this.career = career;
		this.browser = browser;
	} 
	
	
	
}
