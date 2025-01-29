import java.util.Scanner;

/*
 * HW03 - VIN Generator
 *
 * The following program generates a VIN number using input data about their car from the user.
 * These input data are: Vehicle make, model, year, new/not new, avg rating, price, dealership, phone number and
 * serial number.
 *
 * @author Anvit Sinha, L16
 *
 * @version January 30, 2022
 *
 */

public class VinGenerator {
    public static  void main(String[] args){
        Scanner scan = new Scanner(System.in);

        //Getting all user input

        System.out.println("Make: ");           //Get Vehicle Make
        String make = scan.nextLine();
        make = (make.substring(0,1)).toUpperCase() + make.substring(1);         //Capitalize First Letter

        System.out.println("Model: ");          //Get Vehicle Model
        String model = scan.nextLine();
        model = (model.substring(0,1)).toUpperCase() + model.substring(1);      //Capitalize First Letter

        System.out.println("Model Year: ");     //Get Vehicle Model Year
        int year = scan.nextInt();
        scan.nextLine();                        //Used to consume the extra \n

        System.out.println("New Car?: ");       //Is the vehicle new?
        Boolean new_car = scan.nextBoolean();

        System.out.println("Avg. Rating: ");    //Get Vehicle's Average Rating
        double rating = scan.nextDouble();
        scan.nextLine();                        //Used to consume extra \n

        System.out.println("Price ");           //Get Vehicle's Purchase Price
        int price = scan.nextInt();
        scan.nextLine();                        //Used to consume extra \n


        System.out.println("Dealership: ");     //Get the vehicle's dealership
        String dealer_input = scan.nextLine();
        String[] dealer_words = dealer_input.split(" ");      //Splits the words of the dealer separated by space
        String dealer;
        dealer = "";                            //Initialize string dealer
        for (String i : dealer_words){          //Iterate through all words of dealership name
            dealer += i.substring(0,1).toUpperCase() + i.substring(1) + " ";    //capitalize first letter of each word
        }

        System.out.println("Phone Number: ");   //Get user's phone number
        String phone_num = scan.nextLine();

        System.out.println("Serial Number: ");  //Get Vehicle's serial number
        long serial_num = scan.nextLong();
        scan.nextLine();                        // Used to consume the extra \n


        //Generating the VIN for the Vehicle

        //Initialization
        String VIN = "";                                            //Initializing an empty string for VIN
        String serial_num_str = Long.toString(serial_num);          // convert serial number to string
        while (serial_num_str.length() < 6) {                       //Adding leading zeroes that were truncated
            serial_num_str = "0" + serial_num_str;
        }
        String make_upper = make.toUpperCase();                     // convert make into uppercase
        String make_lower = make.toLowerCase();                     // convert make into lowercase
        String model_upper = model.toUpperCase();                   // convert model into uppercase
        String model_lower = model.toLowerCase();                   // convert model into lowercase

        //Part 1
        VIN +=  String.valueOf(year).substring(0,2);                // Adding first 2 digits of model year

        //Part 2
        int Step_2 = make_upper.charAt(0);                          // ASCII value of first letter of uppercase make
        Step_2 += Integer.parseInt(serial_num_str.substring(0,1));  // Adding to first digit of serial number
        char VIN_2 = (char) Step_2;                                 // Convert step 2 to char
        VIN += VIN_2;                                               // Adding result to VIN

        //Part 3
        int Step_3 = make_upper.charAt(make_upper.length()-1);     //ASCII value for last letter of uppercase make
        Step_3 += Integer.parseInt(serial_num_str.substring(0,1)); //Adding to 1st digit of serial number
        char VIN_3 = (char) Step_3;                                // Convert step 3 to char
        VIN += VIN_3;                                              // Adding result to VIN

        //Part 4
        int Step_4 = make_lower.charAt(0);                         // ASCII for first letter of lowercase make
        Step_4 += Integer.parseInt(serial_num_str.substring(1,2)); //Adding to 2nd digit of serial number
        char VIN_4 = (char) Step_4;                                // convert step 4 to char
        VIN += VIN_4;                                              // Adding result to VIN

        //Part 5
        int Step_5 = make_lower.charAt(make_lower.length()-1);     // ASCII value of last letter of lowercase make
        Step_5 += Integer.parseInt(serial_num_str.substring(1,2)); //Adding to 2nd digit of serial number
        char VIN_5 = (char) Step_5;                                //Convert step 5 to char
        VIN += VIN_5;                                              // Adding result to VIN

        //Part 6
        int Step_6 = model_upper.charAt(0);                        // ASCII value of first letter of uppercase model
        Step_6 += Integer.parseInt(serial_num_str.substring(0,1)); // Adding to first digit of serial number
        char VIN_6 = (char) Step_6;                                //Convert step 6 to char
        VIN += VIN_6;                                              // Adding result to VIN

        //Part 7
        int Step_7 = model_upper.charAt(model_upper.length()-1);   // ASCII value of last letter of uppercase model
        Step_7 += Integer.parseInt(serial_num_str.substring(0,1)); //Adding to 1st digit of serial number
        char VIN_7 = (char) Step_7;                                //Convert step 7 to char
        VIN += VIN_7;                                              // Adding result to VIN

        //Part 8
        int Step_8 = model_lower.charAt(0);                        // ASCII value of first letter of lowercase model
        Step_8 += Integer.parseInt(serial_num_str.substring(1,2)); //Adding to 2nd digit of serial number
        char VIN_8 = (char) Step_8;                                //Convert step 8 to char
        VIN += VIN_8;                                              // Adding result to VIN

        //Part 9
        int Step_9 = model_lower.charAt(model_lower.length()-1);   //ASCII value fo last letter of lowercase model
        Step_9 += Integer.parseInt(serial_num_str.substring(1,2)); //Adding to 2nd digit of serial number
        char VIN_9 = (char) Step_9;                                //Convert step 9 to char
        VIN += VIN_9;                                              // Adding result to VIN

        //Part 10
        VIN += serial_num_str.substring(serial_num_str.length()-4);


        //Displaying Given Information with Appropriate Formatting along with Generated VIN

        System.out.printf("%d %s %s \nNew Car?: %b \n",year, make, model, new_car);
        System.out.printf("Avg. Rating: %.1f \nPrice: $%d\n", rating, price);
        System.out.printf("Dealership: %s\n",dealer);
        System.out.printf("Phone Number: (%s)%s-%s \n",phone_num.substring(0,3),phone_num.substring(3,6),
                phone_num.substring(6));
        System.out.printf("Serial Number: %s\n",serial_num_str);
        System.out.printf("VIN: %s\n",VIN);

    }
}
