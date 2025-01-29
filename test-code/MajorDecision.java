import java.util.Scanner;

/**
 * HW04 - Major Decision
 *
 * The following program follows a decision tree based on the user's answers and gives a final output of which major
 * they should choose based on these answers.
 *
 * @author Anvit Sinha, L16
 *
 * @version February 6, 2022
 *
 */

public class MajorDecision {

    // Initialization of Messages
    public static final String WELCOME_MESSAGE = "Hi! Welcome to the major decider. Answer \"Yes\" or \"No\" to " +
            "our questions.";
    public static final String ALREADY_KNOW = "Do you know which major you want?";
    public static final String MATH = "Do you like math?";
    public static final String PEOPLE = "Do you like talking to people?";
    public static final String TEACHING = "Do you like teaching?";
    public static final String SCIENCES = "Do you like the sciences?";
    public static final String MONEY = "Do you think of ways to make money?";
    public static final String LANGUAGES = "Do you like languages?";
    public static final String ENGLISH = "Do you like English?";
    public static final String COMPUTERS = "Do you like using computers?";
    public static final String BUILDING = "Do you like building things?";
    public static final String GOODBYE_MESSAGE = "Thank you. Goodbye.";

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);      //Initialize scanner
        System.out.println(WELCOME_MESSAGE);
        System.out.println(ALREADY_KNOW);
        String answer = scan.nextLine();

        //Start of decision tree

        if (answer.equalsIgnoreCase("Yes")) {        //already knows major
            System.out.println(GOODBYE_MESSAGE);
        } else if (answer.equalsIgnoreCase("No")) {   //doesn't know what major
            System.out.println(MATH);
            answer = scan.nextLine();
            if (answer.equalsIgnoreCase("No")) {     //doesn't like math
                System.out.println(PEOPLE);
                answer = scan.nextLine();
                if (answer.equalsIgnoreCase("Yes")) {        //likes talking to people
                    System.out.println(TEACHING);
                    answer = scan.nextLine();
                    if (answer.equalsIgnoreCase("Yes")) {    //likes teaching
                        System.out.println("Education");
                    } else if (answer.equalsIgnoreCase("No")) {       //doesn't like teaching
                        System.out.println(SCIENCES);
                        answer = scan.nextLine();
                        if (answer.equalsIgnoreCase("Yes")) {        //likes science [doesn't like math]
                            System.out.println("Medicine");
                        } else if (answer.equalsIgnoreCase("No")) {       //doesn't like science
                            System.out.println(MONEY);
                            answer = scan.nextLine();
                            if (answer.equalsIgnoreCase("Yes")) {       //likes money
                                System.out.println("Business");
                            } else if (answer.equalsIgnoreCase("No")) {       //doesn't like money
                                System.out.println("Psychology");
                            } else {
                                System.out.println("Invalid Choice!");
                            }
                        } else {
                            System.out.println("Invalid Choice!");
                        }
                    } else {
                        System.out.println("Invalid Choice!");
                    }
                } else if (answer.equalsIgnoreCase("No")) {       //doesn't like talking to people
                    System.out.println(LANGUAGES);
                    answer = scan.nextLine();
                    if (answer.equalsIgnoreCase("Yes")) {        //likes languages
                        System.out.println(ENGLISH);
                        answer = scan.nextLine();
                        if (answer.equalsIgnoreCase("Yes")) {        //likes english
                            System.out.println("English");
                        } else if (answer.equalsIgnoreCase("No")) {       //doesn't like english
                            System.out.println("Foreign Languages");
                        } else {
                            System.out.println("Invalid Choice!");
                        }
                    } else if (answer.equalsIgnoreCase("No")) {       //doesn't like languages
                        System.out.println("Art");
                    } else {
                        System.out.println("Invalid Choice!");
                    }
                } else {
                    System.out.println("Invalid Choice!");
                }
            } else if (answer.equalsIgnoreCase("Yes")) {      //likes math
                System.out.println(COMPUTERS);
                answer = scan.nextLine();
                if (answer.equalsIgnoreCase("Yes")) {        //likes computers
                    System.out.println("Computer Science");
                } else if (answer.equalsIgnoreCase("No")) {       //doesn't like computers
                    System.out.println(BUILDING);
                    answer = scan.nextLine();
                    if (answer.equalsIgnoreCase("Yes")) {        //likes building things
                        System.out.println("Engineering");
                    } else if (answer.equalsIgnoreCase("No")) {       //doesn't like building things
                        System.out.println(SCIENCES);
                        answer = scan.nextLine();
                        if (answer.equalsIgnoreCase("Yes")) {        // likes the sciences [and likes math]
                            System.out.println("Natural Sciences");
                        } else if (answer.equalsIgnoreCase("No")) {       //doesn't like the sciences
                            System.out.println("Math");
                        } else {
                            System.out.println("Invalid Choice!");
                        }
                    } else {
                        System.out.println("Invalid Choice");
                    }
                } else {
                    System.out.println("Invalid Choice!");
                }
            } else {
                System.out.println("Invalid Choice!");
            }
        } else {
            System.out.println("Invalid Choice!");
        }

    }

}
