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

import java.sql.*;

/**
 * Charger une page HTML
 * http://www.fobec.com/java/908/ouvrir-une-url-charger-son-contenu-format-texte.html
 */

public class RecupBetclicResultatDouble 
{
/**
 * Open a url and read text data, for example html file
 * @param _url url
 * @return String file content
 */

    static final int MATCH_STRING_SIZE = 71;
    static final int HREF_STRING_SIZE = 9;
    static final int ALL_STRING_SIZE = 33;
    static final int SPAN_STRING_SIZE = 7;
    static final int H1_STRING_SIZE = 4;

    public static void main(String[] args)
    {
        saveInFile(createListOfMatch());
    }
    public static void saveInFile(ArrayList<Match> listMatch)
    {
        try
        {

            Class.forName("com.mysql.jdbc.Driver");
            Connection cn = DriverManager.getConnection("jdbc:mysql://jmyx101/FRC_2018?autoReconnect=false&useSSL=false", "frc","esiea000!" );
            Statement st = cn.createStatement();
            String sql = "";
            ResultSet rs;


            PrintWriter writer = new PrintWriter("cote_resultat_double_betclic.txt", "UTF-8");
            
            for(Match m : listMatch)
            {
                writer.println(m.toString());

rs=st.executeQuery("SELECT ID FROM MATCHS m WHERE (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getDom()+"') = m.ID_DOM AND (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getExt()+"') = m.ID_EXT");

                rs.next();

                int id = rs.getInt("ID");

                    st.executeUpdate("UPDATE COTES SET DN = "+m.getCoteDN()+", DE = "+m.getCoteDE()+", NE = "+m.getCoteNE()+" WHERE ID_MATCH = "+id);

st.executeUpdate("UPDATE MATCHS SET A_VENIR = 1 WHERE ID = "+id);

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
        ArrayList<String> linkList = getLinksForResult(); // On recupere les liens des différents matchs

        ArrayList<Match> listMatch = new ArrayList<Match>();

        // On crée un match pour chaque page avec les cotes
        for(int i=linkList.size()-1; i>=0; i--)
        {
            listMatch.add(createMatch(getCodeFromPage(linkList.get(i))));
        }



        /* Affichage */
        for(Match m : listMatch)
        {
            //System.out.println(m.toString());
        }
        

        return listMatch;
    }

    

    public static Match createMatch(String html)
    {
        // Les villes sont entre ces deux positions
        int debut = html.indexOf("<h1>");
        int fin = html.indexOf("</h1>");

        String[] array = html.substring(debut+H1_STRING_SIZE, fin).split(" - "); // On sépare les villes
        String dom = array[0];
        String ext = array[1];

        ArrayList<Double> resultList = getDoubleResult(html); // On recupere les cotes

        double dn = 0;
        double de = 0;
        double en = 0;

        if(resultList.size() == 3) // On applique les cotes que s'il l'on a recolte le bon nombre
        {
            dn = resultList.get(0);
            de = resultList.get(1);
            en = resultList.get(2);
        }
        else
        {
            // Error
            System.err.println("Erreur dans le nombre de cote = " + resultList.size());
            System.exit(-1);
        }

        return new Match(dom, ext, dn, de, en);
    }

    // Liste de 3 cotes
    public static ArrayList<Double> getDoubleResult(String html)
    {
        int debut = 0;
        int fin = 0;
        ArrayList<Double> doubleResultList = new ArrayList<Double>();
        String section;

        debut = html.indexOf("<tr class=\"expand-selection-bet\">"); // On passe la première occurence
        html = html.substring(debut+ALL_STRING_SIZE);

        for(int i = 0; i < 3 ; i++) // On le fait 3 fois car 3 cotes
        {
	    debut = html.indexOf("<tr class=\"expand-selection-bet\">"); // C'est à partir de la seconde que l'on trouve les résultats doubles
            html = html.substring(debut+ALL_STRING_SIZE);

            debut = html.indexOf("</span>"); // On passe le premier
            html = html.substring(debut+SPAN_STRING_SIZE);

            // La cote se trouve entre ces 2 positions
            debut = html.indexOf(">");
            fin = html.indexOf("</span>");
            section = html.substring(debut + 1, fin);

            // Si le resultat est inconnu
            if(section.equals("---"))
            {
                doubleResultList.add(0.0);
            }

            // Sinon on convertit en Double
            else
            {
                try
                {
                    String[] array = new String[2];
                    String d;

                    
                        array = section.split(",");
                        d = array[0] + "." + array[1];
                        doubleResultList.add(Double.parseDouble(d));
                    

                }
                catch(Exception e)
                {
                    e.printStackTrace();
                    System.exit(-1);
                }
            }
            html = html.substring(fin+SPAN_STRING_SIZE); // On replace le début après la dernière balise span

        }

        return doubleResultList;
    }

    // Retoune le code source de la page selon le bout de URL indiqué
    public static String getCodeFromPage(String cutLink)
    {
        return getTextFile("https://www.betclic.fr/"+ cutLink);
    }
    
    // Liste des liens à utiliser pour atteindre les pages de résultat double
    public static ArrayList<String> getLinksForResult()
    {
        String html = getTextFile("https://www.betclic.fr/football/ligue-1-e4"); // code de base
        int last = getLastLinkForResult(html); // dernier index de la séquence
        String section; // section qui sera découper jusqu'à n'avoir que l'adresse URL recherchée
        int debut = 0; // position de début de l'URL + un nombre (selon la section)
        int fin = 0; // position de fin de l'URL (selon la section)
        ArrayList<String> linkList = new ArrayList<String>(); // liste des liens auquel il faudra faire précéder "https://www.betclic.fr/"

        while(last != -1) // Si last = -1 alors il n'ya plus d'occurence dans le code
        {
            section = html.substring(last+MATCH_STRING_SIZE); // = html - tout ce qu'il y a avant la première occurence

            debut = section.indexOf("<a href=\""); // début du lien
            fin = section.indexOf("\" onclick=\"return bcTrack.trackOnClick"); // fin du lien
	    if(debut!=-1){
            	linkList.add(section.substring(debut+HREF_STRING_SIZE, fin)); // ajout du lien à la liste
	    }
            html = html.substring(0, last); // on enlève la partie analyser au code

            last = getLastLinkForResult(html); // on récupère l'occurence précédente
        }

        return linkList;
    }

    // String à partir duquel on va retrouver la séquence désirée en partant par le bas de la page
    public static int getLastLinkForResult(String section)
    {
        return section.lastIndexOf("class=\"match-entry clearfix CompetitionEvtSpe \" data-track-event-name=\"");
    }

    // Récupération du code à partir de l'adresse URL
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
