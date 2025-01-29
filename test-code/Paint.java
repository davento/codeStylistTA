import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.Random;

/**
 * HW12 - Paint
 * <p>
 * The following class sets up a frame with a canvas in the middle. The top panel has buttons with the fill, clear,
 * erase and randomize buttons. The bottom panel allows the user to enter an RGB value or a Hex value for a color and
 * use that color as their brush. The randomize option allows them to randomly use a color for the brush, the clear
 * options clears the canvas and sets the brush to black, the fill option sets the background to the current color and
 * brush to black, and lastly, the erase option sets the brush to the current background color.
 *
 * @author Anvit Sinha, L16
 * @version April 13, 2022
 */

public class Paint extends JComponent implements Runnable {

    Image image; // the canvas
    Graphics2D graphics2D;  // this will enable drawing
    int curX; // current mouse x coordinate
    int curY; // current mouse y coordinate
    int oldX; // previous mouse x coordinate
    int oldY; // previous mouse y coordinate

    // Top Panel
    JButton clrButton;    // Clear Button
    JButton fillButton;     // Fill Button
    JButton eraseButton;    // Erase Button
    JButton randomButton;   // Random Button

    // Bottom Panel
    JTextField hexText;     // text field for hex input
    JTextField rText;       // Text field for Red value of color
    JTextField gText;       // Text field for Green value of color
    JTextField bText;       // Text field for Blue value of color
    JButton hexButton;      // Hex button
    JButton rgbButton;      // RGB Button

    Paint paint; // variable of the type Paint

    // Constructor for the painter

    public Paint() {
        addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                // set oldX and oldY coordinates to beginning mouse press
                oldX = e.getX();
                oldY = e.getY();
            }
        });


        addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseDragged(MouseEvent e) {
                // set current coordinates to where mouse is being dragged
                curX = e.getX();
                curY = e.getY();

                // draw the line between old coordinates and new ones
                graphics2D.drawLine(oldX, oldY, curX, curY);

                // refresh frame and reset old coordinates
                repaint();
                oldX = curX;
                oldY = curY;

            }
        });


    }

    public void clear() {

        // set canvas to white with default paint color
        graphics2D.setPaint(Color.white);
        graphics2D.fillRect(0, 0, getSize().width, getSize().height);
        repaint();

        graphics2D.setPaint(Color.black);   // Sets paint brush to black

    }       // Method to clear the canvas

    public void fill() {

        Color fillColor = (Color) graphics2D.getPaint();    // Gets current pen color
        // set canvas to current paint color
        graphics2D.setPaint(fillColor);
        graphics2D.fillRect(0, 0, getSize().width, getSize().height);
        repaint();

        graphics2D.setBackground(fillColor);        // Sets background to current color

        graphics2D.setPaint(Color.black);           // changes pen to black

    }       // Method to fill canvas with current color

    public void erase() {

        Color eraseColor = graphics2D.getBackground();    // Gets current background color

        graphics2D.setPaint(eraseColor);        // Sets brush to current background color

    }      // Erase drawings method

    public Color randomColor(Random random) {

        int r = 0;
        int g = 0;
        int b = 0;

        int order = random.nextInt(6);      // Selects a random order to assign rgb values
        switch(order) {

            // has 6 cases to accommodate all orders in which r g and b can be arranged
            // nextInt() has a parameter of 256 since the RGB values have to be [0, 255]

            case 0:

                r = random.nextInt(256);
                g = random.nextInt(256);
                b = random.nextInt(256);
                break;



            case 1 :

                g = random.nextInt(256);
                b = random.nextInt(256);
                r = random.nextInt(256);
                break;



            case 2:

                b = random.nextInt(256);
                r = random.nextInt(256);
                g = random.nextInt(256);
                break;

            case 3 :

                r = random.nextInt(256);
                b = random.nextInt(256);
                g = random.nextInt(256);
                break;

            case 4 :

                g = random.nextInt(256);
                r = random.nextInt(256);
                b = random.nextInt(256);
                break;

            case 5 :

                b = random.nextInt(256);
                g = random.nextInt(256);
                r = random.nextInt(256);
                break;


        }   // Assigns rgb values based on the integer stored in order

        Color setColor = new Color(r, g, b);        // creates a new color variable for the random color

        graphics2D.setPaint(setColor);      // Sets brush to random color

        return setColor;

    }       // Method to randomly assign a brush color

    private void setTextFields(int r, int g, int b) {
        String hexStr = String.format("#%02x%02x%02x", r, g, b);    // Converts rgb values to hexadecimal
        hexText.setText(hexStr);    // Sets text for hexText field

        // Set text fields
        rText.setText(String.valueOf(r));
        gText.setText(String.valueOf(g));
        bText.setText(String.valueOf(b));
        hexText.setText(hexStr);
    }   // Update texts with appropriate RGB values and Hex string

    public void setBrushColor(Color c) {

        graphics2D.setPaint(c);     // sets brush color

    }   // Method to set brush color

    @Override
    protected void paintComponent(Graphics g) {
        if (image == null) {
            image = createImage(getSize().width, getSize().height);

            graphics2D = (Graphics2D) image.getGraphics();

            graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                    RenderingHints.VALUE_ANTIALIAS_ON);

            // set canvas to white with default paint color
            graphics2D.setPaint(Color.white);
            graphics2D.fillRect(0, 0, getSize().width, getSize().height);
            graphics2D.setPaint(Color.black);
            repaint();

            graphics2D.setStroke(new BasicStroke(5));

        }
        g.drawImage(image, 0, 0, null);
    }

    @Override
    public void run() {

        // ---------- Setup -----------

        JFrame frame = new JFrame("Painting Canvas");      // Creates a new frame

        Container content = frame.getContentPane();     // creates container for the canvas

        // Sets the painting canvas in the center
        content.setLayout(new BorderLayout());
        paint = new Paint();    // New paint variable initialized
        content.add(paint, BorderLayout.CENTER);    // add canvas to content


        //Configure the JFrame
        frame.setSize(852, 480);    // Sets frame to the size of a standard 480p display
        frame.setLocationRelativeTo(null);
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.setVisible(true);                 // Makes the frame visible

        // Sets up the random object to use for the random color generator
        Random random = new Random();


        // ---------- Top Panel ----------

        // Initialize buttons
        clrButton = new JButton("Clear");
        fillButton = new JButton("Fill");
        eraseButton = new JButton("Erase");
        randomButton = new JButton("Randomize");

        // Add buttons to a topPanel
        JPanel topPanel = new JPanel();
        topPanel.add(clrButton);
        topPanel.add(fillButton);
        topPanel.add(eraseButton);
        topPanel.add(randomButton);
        content.add(topPanel, BorderLayout.NORTH);     // Add topPanel to container

        clrButton.addActionListener(new ActionListener() {        // Add an action listener
            public void actionPerformed(ActionEvent e) {

                // Clears text fields
                rText.setText("");
                gText.setText("");
                bText.setText("");
                hexText.setText("#");

                paint.clear();      // calls clear method

            }
        }); // Action listener for clear button

        fillButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                // clears text fields
                rText.setText("");
                gText.setText("");
                bText.setText("");
                hexText.setText("#");

                paint.fill();       // calls fill method

            }
        }); // Action listener for fill button

        eraseButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                paint.erase();      // calls erase method

            }
        }); // Action listener for erase button

        randomButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                Color newColor = paint.randomColor(random);     // calls random method and assigns returned color

                int r = newColor.getRed();
                int g = newColor.getGreen();
                int b = newColor.getBlue();

                setTextFields(r, g, b);     // Sets text fields according to rgb values of current color


            }
        }); // Action listener for random button


        // ---------- Bottom Panel ----------

        // Initialize Buttons and text fields
        hexButton = new JButton("Set Hex Color");
        hexText = new JTextField("#", 10);

        rgbButton = new JButton("Set RGB Color");
        rText = new JTextField("", 5);
        gText = new JTextField("", 5);
        bText = new JTextField("", 5);


        // Add buttons and text fields to a topPanel
        JPanel bottomPanel = new JPanel();
        bottomPanel.add(hexText);
        bottomPanel.add(hexButton);
        bottomPanel.add(rText);
        bottomPanel.add(gText);
        bottomPanel.add(bText);
        bottomPanel.add(rgbButton);
        content.add(bottomPanel, BorderLayout.SOUTH);   // Adds panel to the canvas

        rgbButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                int r;
                int g;
                int b;

                try {

                    if (rText.getText().isBlank()) {

                        r = 0;

                    } else {

                        r = Integer.parseInt(rText.getText());

                        if (r > 255) {      // r value cannot be greater than 255
                            throw new NumberFormatException();
                        }

                    }   // Sets r field to 0 if empty, or the value given

                    if (gText.getText().isBlank()) {

                        g = 0;

                    } else {

                        g = Integer.parseInt(gText.getText());

                        if (g > 255) {      // g value cannot be greater than 255
                            throw new NumberFormatException();
                        }

                    }   // Sets g field to 0 if empty, or the value given

                    if (bText.getText().isBlank()) {

                        b = 0;

                    } else {

                        b = Integer.parseInt(bText.getText());

                        if (b > 255) {      // b value cannot be greater than 255
                            throw new NumberFormatException();
                        }

                    }   // Sets b field to 0 if empty, or the value given

                    setTextFields(r, g, b);     // Sets text fields according to the rgb values

                    Color newColor = new Color(r, g, b);

                    paint.setBrushColor(newColor);  // sets the brush color

                } catch (NumberFormatException ex) {

                    JOptionPane.showMessageDialog(null, "Not a valid RGB Value", "Error",
                            JOptionPane.ERROR_MESSAGE);

                }   // Shows error message if a non - valid rgb value is given

            }
        });

        hexButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                try {

                    String hexStr = hexText.getText();

                    Color color = Color.decode(hexStr); // converts hex field to a color

                    setTextFields(color.getRed(), color.getGreen(), color.getBlue());

                    paint.setBrushColor(color);     // sets brush color

                } catch (NumberFormatException ex) {

                    JOptionPane.showMessageDialog(null, "Not a valid Hex Value", "Error",
                            JOptionPane.ERROR_MESSAGE);     // shows error if invalid hex is provided

                }

            }
        });


    }       // run method

    public static void main(String[] args) {

        SwingUtilities.invokeLater(new Paint());

    }

}
