import java.util.Scanner;

/**
 * A Food Truck order program.
 *
 * Purdue University -- CS18000 -- Spring 2022 -- Homework 04 -- Debugging
 *
 * @author Purdue CS
 * @version January 10, 2021
 */
public class FoodTruck {
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.println("Would you like to place an order? (yes or no)");
        String orderStatus = scanner.nextLine();

        String category = "";
        String cookMethod = "";
        String dish = "";

        if (orderStatus.equals("no")) {
            System.out.println("Okay, have a nice day!");

        } else if (orderStatus.equals("yes")) {

            System.out.println("What would you like to order?");

            System.out.println("1. Lamb");
            System.out.println("2. Pork");
            System.out.println("3. Chicken");
            System.out.println("4. Vegetables");

            int selection = scanner.nextInt();

            switch (selection) {
                case 1 -> category = "Lamb";
                case 2 -> category = "Pork";
                case 3 -> category = "Chicken";
                case 4 -> category = "Vegetables";
                default -> {
                    System.out.println("Input Error! Valid menu options are from 1 - 4.");
                    System.out.println("We couldn't complete the order, sorry!");
                    return;
                }
            }

            System.out.println("How would you like it cooked?");
            System.out.println("1. Fried");
            System.out.println("2. Boiled");

            selection = scanner.nextInt();

            switch (selection) {
                case 1 -> cookMethod = "Fried";
                case 2 -> cookMethod = "Boiled";
                default -> {
                    System.out.println("Input Error! Valid cooking options are 1 or 2.");
                    System.out.println("We couldn't complete the order, sorry!");
                    return;
                }
            }

            dish = cookMethod + " " + category;
            System.out.println("You have ordered " + dish + "!");

        }else{
            String err  = "Input Error! Valid options are yes or no.";
            System.out.println(err);
        }

    }
}
