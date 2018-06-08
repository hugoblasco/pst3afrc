import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

import java.util.Date;
import java.util.Calendar;
import java.util.Locale;
import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.io.PrintWriter;

import java.io.*;

import java.sql.*;

// Si match non joué : le score est (-1 -1)

/**
 * Charger une page HTML
 * http://www.fobec.com/java/908/ouvrir-une-url-charger-son-contenu-format-texte.html
 */

public class RecupSoccerStats {
/**
 * Open a url and read text data, for example html file
 * @param _url url
 * @return String file content
 */

    static final int DATA_STRING_SIZE = 10;
    static final int TIRET_STRING_SIZE = 3;
    static final int BOLD_STRING_SIZE = 3;
    static final int DATETIME_STRING_SIZE = 13;
    static final int ROUND_STRING_SIZE = 7;
    static final int DECAL_STRING_SIZE = 12;
    static final int HEUR_STRING_SIZE = 29;

    public static void main(String[] args)
    {
        saveInFile(createListOfMatch());
    }

    public static void saveInFile(ArrayList<Match> listMatch)
    {

	SimpleDateFormat hourDateFormat = new SimpleDateFormat("HH:mm dd/MM/yyyy");

        try
        {
	    Class.forName("com.mysql.jdbc.Driver");
            Connection cn = DriverManager.getConnection("jdbc:mysql://jmyx101/FRC_2018?autoReconnect=false&useSSL=false","frc","esiea000!");
            Statement st = cn.createStatement();
	    ResultSet rs;

            PrintWriter writer = new PrintWriter("score_soccerstats.txt", "UTF-8");
	    Calendar cal = Calendar.getInstance();
	    cal.add( Calendar.DAY_OF_YEAR, -1);
	    Date min = cal.getTime();
	    cal.add( Calendar.DAY_OF_YEAR, 2);
            Date max = cal.getTime();
            BufferedReader br = new BufferedReader(new FileReader("switch-recup-totalite-soccerstats.txt"));
            String line;
            line = br.readLine();
            br.close();
	    Boolean total = Boolean.valueOf(line);
            for(Match m : listMatch)
            {
		if((m.getDate().compareTo(min) > 0 && m.getDate().compareTo(max) < 0) || total == true){
			writer.println(m.toString());
			rs = st.executeQuery("SELECT ID FROM MATCHS m WHERE (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getDom()+"') = m.ID_DOM AND (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getExt()+"') = m.ID_EXT");
            
			if(rs.next()){

			    int id = rs.getInt("ID");

			    cal.setTime(m.getDate());
			    cal.add(Calendar.HOUR_OF_DAY, 1);

			    st.executeUpdate("UPDATE MATCHS SET JOURNEE = "+m.getJournee()+", BUTS_DOM = "+m.getDomPoints()+", BUTS_EXT = "+m.getExtPoints()+", DATE = '"+hourDateFormat.format(cal.getTime())+"', A_VENIR = 0 WHERE ID = "+id);

			}else{

			    rs = st.executeQuery("SELECT ID FROM EQUIPES WHERE EQUIPE = '"+m.getDom()+"'");
			    rs.next();
			    int iddom = rs.getInt("ID");
			    rs = st.executeQuery("SELECT ID FROM EQUIPES WHERE EQUIPE = '"+m.getExt()+"'");
	                    rs.next();
	                    int idext = rs.getInt("ID");

			    st.executeUpdate("INSERT INTO MATCHS (JOURNEE,BUTS_DOM,BUTS_EXT,ID_DOM,ID_EXT) VALUES ("+m.getJournee()+","+m.getDomPoints()+","+m.getExtPoints()+","+iddom+","+idext+")");
			    rs = st.executeQuery("SELECT ID FROM MATCHS m WHERE (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getDom()+"') = m.ID_DOM AND (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getExt()+"') = m.ID_EXT");
			    rs.next();
			    int id = rs.getInt("ID");
			    st.executeUpdate("INSERT INTO COTES (ID_MATCH) VALUES ("+id+")");

			}
		}
	    }

            writer.close();

	    cn.close();
	    st.close();
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
        int j;
        String s = new String();

        for(int i=listOfDays.size()-1; i>=0; i--)
        {
            s = listOfDays.get(i);
            listOfMatch = getSectionOfListOfMatch(s);
            j = getJournee(s);

            for(int k = listOfMatch.size()-1; k>=0; k--)
            {
                listMatch.add(createMatch(j, listOfMatch.get(k)));
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

    public static int getJournee(String section) // à donner : 1 journee
    {
    	int debut = section.indexOf("Round");
    	section = section.substring(debut);

    	int fin = section.indexOf("</b>");
    	section = section.substring(0+ROUND_STRING_SIZE, fin);

    	int journee = 0;
    	try
    	{
    		journee = Integer.parseInt(section);
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
            System.exit(-1);
    	}

    	return journee;
    }

    public static String getHour(String section) // à donner : 1 match
    {
    	int debut = section.indexOf("<font color='green' size='1'>");
    	section = section.substring(debut);

    	int fin = section.indexOf("</font>");
    	section = section.substring(0+HEUR_STRING_SIZE, fin);

    	return section;
    }

    public static Date getDate(String section) // à donner : 1 match
    {
        String heure = getHour(section);

        int debut = section.indexOf("color='gray'>");
        section = section.substring(debut);

        int fin = section.indexOf(" \n</font>");
        if(fin == -1)
        {
        	fin = section.indexOf("\n </font>");
        }
        section = section.substring(0+DATETIME_STRING_SIZE, fin);

        section = heure + " " + section;

        SimpleDateFormat format = new SimpleDateFormat("HH:mm EEE. d MMM.", Locale.US); // Fri. 3 Feb.
        SimpleDateFormat better = new SimpleDateFormat("HH:mm EEE. d MMM. yyyy", Locale.US); // Fri. 3 Feb.
        Date date = new Date();


        try
        {
            date = format.parse(section);

            Calendar today = Calendar.getInstance();
        	SimpleDateFormat month = new SimpleDateFormat("M", Locale.US);
        	SimpleDateFormat year = new SimpleDateFormat("yyyy", Locale.US);

        	int d = Integer.parseInt(month.format(date));

        	if(d >= 8 )
        	{
        		section = section + " 2017";
        	}
        	else
        	{
        		section = section + " 2018";
        	}

        	date = better.parse(section);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            System.exit(-1);
        }

        return date;
    }
    public static Match createMatch(int journee, String section) // à donner : 1 match
    {
        Boolean pass = false;

        /* Date */

	Date date = getDate(section);

        Calendar today = Calendar.getInstance();
        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");

        if(date.after(today.getTime()) || format.format(date).equals(format.format(today.getTime())))
        {
        	pass = true;
        }

        /* Villes */
        int debut = section.indexOf("<td>&nbsp;");
        int bis = section.indexOf("</font></td>");
        int fin = section.substring(bis+DECAL_STRING_SIZE).indexOf("</td>")+bis+DECAL_STRING_SIZE;

        String villes = section.substring(debut+DATA_STRING_SIZE, fin);

        String[] array = villes.split(" - ");

        // Dom
        String dom = array[0];
        // Ext
        String ext = array[1];

        /* Points */
        Integer domPoints = 0;
        Integer extPoints = 0;
        if(pass)
        {
        	domPoints = -1;
        	extPoints = -1;
        }
        else
        {
        	ArrayList<Integer> listOfPoints = convertPoints(section);
	        if(listOfPoints.size() == 2)
	        {
	            domPoints = listOfPoints.get(0);
	            extPoints = listOfPoints.get(1);
	        }
	        else
	        {
	            // Error
	            //System.err.println("Erreur dans le nombre de points = " + listOfPoints.size());
	            //System.exit(-1);
		    domPoints = -1;
		    extPoints = -1;
	        }
	    }

        return new Match(date, dom, ext, domPoints, extPoints, journee);

    }
    public static ArrayList<Integer> convertPoints(String section) // à donner : 1 match
    {
        ArrayList<String> listOfStringPoints = getSectionOfListOfPoints(section);
        ArrayList<Integer> listOfIntPoints = new ArrayList<Integer>(); 

        try
        {
            String[] array = new String[2];
            String d;

            for(String s : listOfStringPoints)
            {
                if(s.equals("pp.")) // match non joué
                {
                	listOfIntPoints.add(-1);
                	listOfIntPoints.add(-1);
                	break;
                }
                array = s.split(" - ");
                listOfIntPoints.add(Integer.parseInt(array[0]));
                listOfIntPoints.add(Integer.parseInt(array[1]));
            }

        }
        catch(Exception e)
        {
            e.printStackTrace();
            System.exit(-1);
        }

        return listOfIntPoints;
    }
    public static ArrayList<String> getSectionOfListOfPoints(String section) // à donner : 1 match
    {
        ArrayList<String> listOfPoints = new ArrayList<String>();

        int last = getSectionOfLastPoints(section);
        int start, end = 0;
        String tmp;

        while(last != -1)
        {
            tmp = section.substring(last);
            start = tmp.indexOf("<b>");
            end = tmp.indexOf("</b>");

            if(start != tmp.indexOf("<b><a") && start != tmp.indexOf("<b>&nbsp;&nbsp;&nbsp;"))
            {
            	listOfPoints.add(tmp.substring(start+BOLD_STRING_SIZE, end));
            }

            section = section.substring(0, last-1);

            last = getSectionOfLastPoints(section);
        }

        return listOfPoints;
    }
    public static int getSectionOfLastPoints(String section) // à donner : 1 match
    {
        return section.lastIndexOf("<td align='center'>\n<b>");
    }
    public static ArrayList<String> getSectionOfListOfMatch(String section) // à donner : 1 journee
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

    public static int getSectionOfLastMatch(String section) // à donner : 1 journee
    {
        return section.lastIndexOf("<tr class='odd'>");
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
        return section.lastIndexOf("<tr class='even'>");
    }
    public static String getSection() // à donner : site
    {
        String html = getTextFile("http://www.soccerstats.com/table.asp?league=france&tid=a");
        
        int debutSection = html.indexOf("<td valign='top' align='center'>");   
        String debutHTML = html.substring(debutSection);

        int finSection = debutHTML.lastIndexOf("<p align='left'></p>");

        return debutHTML.substring(0, finSection);

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
