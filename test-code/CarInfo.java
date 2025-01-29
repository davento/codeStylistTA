import java.util.Scanner;
public class CarInfo {
    public static void main(String[] args){
        Scanner scan = new Scanner(System.in);
        System.out.println("Enter car's make: ");
        String make = scan.nextLine();
        System.out.println("Enter car's model: ");
        String model = scan.nextLine();
        System.out.println("Enter car's highway and city MPG: ");
        int highway_mpg = scan.nextInt();
        int city_mpg = scan.nextInt();
        System.out.println("Enter car's ratings of performance and comfort: ");
        double performance = scan.nextDouble();
        double comfort = scan.nextDouble();
        System.out.printf("Make: %s \nModel: %s \nHighway MPG: %d \nCity MPG: %d \n",make,model,highway_mpg,city_mpg);
        System.out.printf("Performance Rating: %.1f \nComfort Rating: %.1f",performance,comfort);
    }
}
