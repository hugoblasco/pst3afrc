import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

import java.util.Date;
import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.io.PrintWriter;

/**
 * Charger une page HTML
 * http://www.fobec.com/java/908/ouvrir-une-url-charger-son-contenu-format-texte.html
 */

public class HTTPLoader {
/**
 * Open a url and read text data, for example html file
 * @param _url url
 * @return String file content
 */

    static final int DATA_STRING_SIZE = 23;
    static final int TIRET_STRING_SIZE = 2;
    static final int DATETIME_STRING_SIZE = 10;

    public static void main(String[] args)
    {
        saveInFile(createListOfMatch());
    }
    public static void saveInFile(ArrayList<Match> listMatch)
    {
        try
        {
            PrintWriter writer = new PrintWriter("cote.txt", "UTF-8");
            
            for(Match m : listMatch)
            {
                writer.println(m.toString());
            }
            
            writer.close();
        } 
        catch (Exception e) 
        {
         e.printStackTrace();
         System.exit(-1);
        }

        System.err.println("Fichier écrit !");
    }
    public static ArrayList<Match> createListOfMatch()
    {
            // Récupérer la date
            // Tester avec le toString

        ArrayList<Match> listMatch = new ArrayList<Match>();

        ArrayList<String> listOfDays = getSectionOfListOfDays(getSection());
        ArrayList<String> listOfMatch = new ArrayList<String>();
        Date d = new Date();
        String s = new String();

        for(int i=listOfDays.size()-1; i>=0; i--)
        {
            s = listOfDays.get(i);
            listOfMatch = getSectionOfListOfMatch(s);
            d = getDate(s);

            for(String c : listOfMatch)
            {
                listMatch.add(createMatch(d, c));
            }
        }

        /* Affichage
        for(Match m : listMatch)
        {
            System.out.println(m.toString());
        }
        */

        return listMatch;
    }

    public static Date getDate(String section) // à donner : 1 jour
    {
        int debut = section.indexOf("datetime=\"");
        section = section.substring(debut);

        int fin = section.indexOf("\">");
        section = section.substring(0+DATETIME_STRING_SIZE, fin);

        SimpleDateFormat format = new SimpleDateFormat("yyyy-M-d"/*, Locale.FRENCH*/); // 2017-2-4
        Date date = new Date();

        try
        {
            date = format.parse(section);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            System.exit(-1);
        }

        return date;
    }
    public static Match createMatch(Date date, String section) // à donner : 1 match
    {
        /* Villes */
        int debut = section.indexOf("data-track-event-name=\"");
        int fin = section.indexOf("\">");
        String villes = section.substring(debut+DATA_STRING_SIZE, fin);

        int tiret = villes.indexOf(" -");

        // Dom
        String dom = villes.substring(0, tiret);
        // Ext
        String ext = villes.substring(tiret+TIRET_STRING_SIZE+1);
        
        /* Cotes */
        ArrayList<Double> listOfCotation = convertCotation(section);
        double coteN = 0;
        double coteD = 0;
        double coteE = 0;
        if(listOfCotation.size() == 3)
        {
            coteD = listOfCotation.get(0);
            coteN = listOfCotation.get(1);
            coteE = listOfCotation.get(2);
        }
        else
        {
            // Error
            System.err.println("Erreur dans le nombre de cote = " + listOfCotation.size());
            System.exit(-1);
        }

        return new Match(date, dom, ext, coteN, coteD, coteE);

    }
    public static ArrayList<Double> convertCotation(String section) // à donner : 1 match
    {
        ArrayList<String> listOfStringCotation = getSectionOfListOfCotation(section);
        ArrayList<Double> listOfDoubleCotation = new ArrayList<Double>();

        try
        {
            String[] array = new String[2];
            String d;

            for(String s : listOfStringCotation)
            {
                array = s.split(",");
                d = array[0] + "." + array[1];
                listOfDoubleCotation.add(Double.parseDouble(d));
            }

        }
        catch(Exception e)
        {
            e.printStackTrace();
            System.exit(-1);
        }

        return listOfDoubleCotation;
    }
    public static ArrayList<String> getSectionOfListOfCotation(String section) // à donner : 1 match
    {
        ArrayList<String> listOfCotation = new ArrayList<String>();

        int last = getSectionOfLastCotation(section);
        int start, end = 0;
        String tmp;

        while(last != -1)
        {
            tmp = section.substring(last);
            start = tmp.indexOf("\">");
            end = tmp.indexOf("</");
            //tmp = tmp.substring(start+TIRET_STRING_SIZE, end);

            listOfCotation.add(tmp.substring(start+TIRET_STRING_SIZE, end));
            section = section.substring(0, last-1);

            last = getSectionOfLastCotation(section);
        }

        return listOfCotation;
    }
    public static int getSectionOfLastCotation(String section) // à donner : 1 match
    {
        return section.lastIndexOf("<span class=\"odd-button");
    }
    public static ArrayList<String> getSectionOfListOfMatch(String section) // à donner : 1 jour
    {
        ArrayList<String> listOfMatch = new ArrayList<String>();

        int last = getSectionOfLastMatch(section);

        while(last != -1)
        {
            listOfMatch.add(section.substring(last));
            section = section.substring(0, last-1);

            last = getSectionOfLastMatch(section);
        }

        return listOfMatch;
    }

    public static int getSectionOfLastMatch(String section) // à donner : 1 jour
    {
        return section.lastIndexOf("<div id=\"match_");
    }

    public static ArrayList<String> getSectionOfListOfDays(String section) // à donner : section de base
    {
        ArrayList<String> listOfDays = new ArrayList<String>();
        int last = getSectionOfLastDay(section);

        while(last != -1)
        {
            listOfDays.add(section.substring(last));
            section = section.substring(0, last-1);

            last = getSectionOfLastDay(section);
        }

        return listOfDays;

    }
    public static int getSectionOfLastDay(String section) // à donner : section de base
    {
        return section.lastIndexOf("<div class=\"entry day-entry grid-9 nm");
    }
    public static String getSection() // à donner : site
    {
        String html = getTextFile("https://www.betclic.fr/football/ligue-1-e4");
        
        int debutSection = html.indexOf("<section class=\"grid-9\">");        
        String debutHTML = html.substring(debutSection);
        
        int apresSection = debutHTML.indexOf("<div id=\"right-col\" class=\"grid-3\">");        
        String section = debutHTML.substring(0, apresSection);

        int finSection = section.lastIndexOf("</section>");

        return section.substring(0, finSection);

    }
    public static String getTextFile(String _url) 
    {
        BufferedReader reader = null;
        try 
        {
            URL url = new URL(_url);
            URLConnection urlConnection = url.openConnection();
            reader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
                sb.append("\n");
            }
            return sb.toString();
        } 
        catch (IOException ex) 
        {
            Logger.getLogger(HTTPLoader.class.getName()).log(Level.SEVERE, null, ex);
            return "";
        } 
        finally 
        {
            try 
            {
                if (reader != null) 
                {
                    reader.close();
                }
            } 
            catch (IOException ex) 
            {
                Logger.getLogger(HTTPLoader.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
} 