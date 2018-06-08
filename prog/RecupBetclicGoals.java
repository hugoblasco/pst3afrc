/* Sur une page de match */
// Nombre total de buts
// Total de buts par équipe

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

import java.util.HashMap;

import java.sql.*;

/**
 * Charger une page HTML
 * http://www.fobec.com/java/908/ouvrir-une-url-charger-son-contenu-format-texte.html
 */

public class RecupBetclicGoals
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
    static final int EXPAND_SELECTION_SIZE = 24;

    //static final String PAGE = "/home/hyenaqueen/Windows/recup_betclic/page_betclic.html";
    static final String PAGE = "https://www.betclic.fr/football/ligue-1-e4";

    public static void main(String[] args)
    {
        saveInFile(createListOfMatch());
    }
    public static void saveInFile(ArrayList<MatchGoals> listMatch)
    {
        try
        {
int i = 0;
	    Class.forName("com.mysql.jdbc.Driver");
            Connection cn = DriverManager.getConnection("jdbc:mysql://jmyx101/FRC_2018?autoReconnect=false&useSSL=false", "frc","esiea000!" );
            Statement st = cn.createStatement();
            String sql = "";
            ResultSet rs;


            PrintWriter writer = new PrintWriter("cote_total_goals_betclic.txt", "UTF-8");

ArrayList<Double> goalsOui;
ArrayList<Double> goalsNon;
ArrayList<Double> goals;

            for(MatchGoals m : listMatch)
            {
                writer.println(m.totalGoalsToString());

		rs=st.executeQuery("SELECT ID FROM MATCHS m WHERE (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getDom()+"') = m.ID_DOM AND (SELECT ID FROM EQUIPES WHERE EQUIPE LIKE '"+m.getExt()+"') = m.ID_EXT");

                rs.next();

                int id = rs.getInt("ID");

		if(m.goalsForEchTeam != null){

		    goalsOui = m.goalsForEchTeam.get("oui");

		    if(goalsOui != null){

i = 0;
          for(Double d : goalsOui){
            if( i == 0){

if(d!=null)                	st.executeUpdate("UPDATE COTES SET DOM_MARQ = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
if(d!=null)  st.executeUpdate("UPDATE COTES SET EXT_MARQ = "+d+" WHERE ID_MATCH = "+id);
}

		    }
		    }

goalsNon = m.goalsForEchTeam.get("non");

		    if(goalsNon != null){

i = 0;
          for(Double d : goalsNon){
            if( i == 0){

             if(d!=null)     	st.executeUpdate("UPDATE COTES SET DOM_MARQ_PAS= "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
if(d!=null)  st.executeUpdate("UPDATE COTES SET EXT_MARQ_PAS = "+d+" WHERE ID_MATCH = "+id);
}

		    }

		}
	    }

		if(m.totalGoals != null){

      goals = m.totalGoals.get("- de 0,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

             if(d!=null)     	st.executeUpdate("UPDATE COTES SET M_UN = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("- de 1,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET M_DEUX = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("- de 2,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET M_TROIS = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("- de 3,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET M_QUATRE = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("- de 4,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET M_CINQ = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("- de 5,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET M_SIX = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("+ de 0,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET P_ZERO = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("+ de 1,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET P_UN = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("+ de 2,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET P_DEUX = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("+ de 3,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET P_TROIS = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("+ de 4,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET P_QUATRE= "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

      goals = m.totalGoals.get("+ de 5,5");
if(goals!=null){
i = 0;
 for(Double d : goals){

if( i == 0){

if(d!=null)                  	st.executeUpdate("UPDATE COTES SET P_CINQ = "+d+" WHERE ID_MATCH = "+id);
i++;

}else{
//résultats à la mitemps
}

}

}

}



            }

            writer.close();

            writer = new PrintWriter("cote_team_goals_betclic.txt", "UTF-8");

            for(MatchGoals m : listMatch)
            {
                writer.println(m.goalsForEachTeamToString());
                System.err.println(m.goalsForEachTeamToString());
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
    public static ArrayList<MatchGoals> createListOfMatch()
    {
        ArrayList<String> linkList = getLinksForResult(); // On recupere les liens des différents matchs

        ArrayList<MatchGoals> listMatch = new ArrayList<MatchGoals>();

        /* On crée un match pour chaque page avec les cotes */
        for(int i=linkList.size()-1; i>=0; i--)
        {
            listMatch.add(createMatch(getCodeFromPage(linkList.get(i))));
        }

       /* FOR TEST
       listMatch.add(createMatch(getTextFile(PAGE)));
       */
        /* Affichage
        for(MatchGoals m : listMatch)
        {
            System.out.println(m.toString());
        }

        System.err.println("Fin affichage");*/
        return listMatch;
    }

    public static MatchGoals createMatch(String html)
    {
        // Les villes sont entre ces deux positions
        int debut = html.indexOf("<h1>");
        int fin = html.indexOf("</h1>");

        String[] array = html.substring(debut+H1_STRING_SIZE, fin).split(" - "); // On sépare les villes
        String dom = array[0].replace(" ", "");
        String ext = array[1].replace(" ", "");

        // mettre dom et ext en miniscule
        //les accoler avec un '-'
        // indexOf
        // split "
        // getTextFile
        return new MatchGoals(dom, ext, getTotalNbOfGoals(html), getGoalsForEachTeam(html));
    }

    // Dans une case = String, double, double = "oui/non", buts de l'équipe à dom, buts de l'équipe à ext
    public static HashMap<String, ArrayList<Double>> getGoalsForEachTeam(String html){
      int debut = 0;
      int fin = 0;

      HashMap<String, ArrayList<Double>> map = new HashMap<String, ArrayList<Double>>();

      debut = html.indexOf("<a class=\"qTip icon icon-tooltip-small-grey\" href=\"javascript:void(0);\" tabindex=\"-1\" title=\"But marqué par...\"></a>"); // On passe l'occurence
      if(debut != -1){
      html = html.substring(debut);

      debut = html.indexOf("<tr class=\"expand-selection-bet\">"); // C'est à partir de là que l'on trouve les résultats
      html = html.substring(debut+EXPAND_SELECTION_SIZE);

      for(int i = 0; i < 2 ; i++) // On le fait 2 fois par match
      {
          // chercher l'expand
          //
          // on </td><td> quand aucun resultat n'est communiqué

          String dom = "";
          String ext = "";
          String key = "";

          debut = html.indexOf("<td class=\"nameScorer\">"); // On passe le premier
          html = html.substring(debut+EXPAND_SELECTION_SIZE); // \n ?

          key = html.substring(12, 15).toLowerCase();

          if(html.indexOf("</td><td>") != -1){ // Si la cote du match existe
            debut = html.indexOf("</span>"); // on passe le span
            html = html.substring(debut+SPAN_STRING_SIZE);

            fin = html.indexOf("</span>");

            dom = html.substring(fin-4, fin).replace(",", ".");

            debut = html.indexOf("</span>"); // on passe le span
            html = html.substring(debut+SPAN_STRING_SIZE);
          }

          if(html.indexOf("</td><td>") != -1){ // Si la cote a la mt existe
            debut = html.indexOf("</span>"); // on passe le span
            html = html.substring(debut+SPAN_STRING_SIZE);

            fin = html.indexOf("</span>");

            ext = html.substring(fin-4, fin).replace(",", ".");
          }

          ArrayList<Double> doubleList = new ArrayList<Double>();

          try{
            if(dom == "")
              doubleList.add(null);
            else
              doubleList.add(Double.parseDouble(dom));

            if(ext == "")
              doubleList.add(null);
            else
              doubleList.add(Double.parseDouble(ext));
          } catch(Exception e) {
            e.printStackTrace();
            System.exit(-1);
          }

          if(key != "")
            map.put(key, doubleList);
          else{
            System.err.println("getGoalsForEachTeam - empty key");
            System.exit(-1);
          }
          /*
          fin = html.indexOf("<tr class=\"expand-selection-bet\">");
          html = html.substring(fin+EXPAND_SELECTION_SIZE); // On replace le début après la dernière balise expand
          */
        }
        return map;
      }
      return null;
    }

    // Dans une case = String, double, double = "+/- de x [buts]", buts pour le match, buts pour la 1e MT
    public static HashMap<String, ArrayList<Double>> getTotalNbOfGoals(String html){
      int debut = 0;
      int fin = 0;

      HashMap<String, ArrayList<Double>> map = new HashMap<String, ArrayList<Double>>();

      debut = html.indexOf("<a class=\"qTip icon icon-tooltip-small-grey\" href=\"javascript:void(0);\" tabindex=\"-1\" title=\"Nombre total de buts\"></a>"); // On passe l'occurence
      fin = html.indexOf("<span class=\"label-market\">Score exact</span>");
      if(debut != -1){

        if(fin == -1)
          html = html.substring(debut);
        else
          html = html.substring(debut, fin);

        debut = html.indexOf("<tr class=\"expand-selection-bet\">"); // C'est à partir de là que l'on trouve les résultats
        html = html.substring(debut+EXPAND_SELECTION_SIZE);

        int i = 0;
        while(i<12) // On le fait 12 fois par match
        {
            // chercher l'expand
            //
            // on </td><td> quand aucun resultat n'est communiqué

            i++;

            String match = "";
            String mt = "";
            String key = "";

            debut = html.indexOf("<td class=\"nameScorer\">"); // On passe le premier
            html = html.substring(debut+EXPAND_SELECTION_SIZE); // \n ?

            key = html.substring(12, 20);

            // Eviter les lignes non necessaires
            if(key.toLowerCase().contains("oui") || key.toLowerCase().contains("non") || !key.contains(" de "))
              continue;

            debut = html.indexOf("</span>"); // on passe le span
            if(html.indexOf("</td><td>") > debut){ // Si la cote du match existe : pas de "td" avant le debut
            html = html.substring(debut+SPAN_STRING_SIZE);

            fin = html.indexOf("</span>");

            match = html.substring(fin-4, fin).replace(",", ".");

            debut = html.indexOf("</span>"); // on passe le span
            html = html.substring(debut+SPAN_STRING_SIZE);
          } else
            System.err.println("No data for match goals, key = " + key);

          debut = html.indexOf("</span>"); // on passe le span
          if(html.indexOf("</td></tr>") > 15){ // Si la cote a la mt existe : pas de "td" immediatement pres le debut
            html = html.substring(debut+SPAN_STRING_SIZE);

            fin = html.indexOf("</span>");

            mt = html.substring(fin-4, fin).replace(",", ".");
          } else {
            System.err.println("No data for mid-term goals, key = " + key);
            html = html.substring(html.indexOf("</td><td>"));
          }

          //System.err.println(key + " : " + match + " - " + mt);

          ArrayList<Double> doubleList = new ArrayList<Double>();

          try{
            if(match == "")
              doubleList.add(null);
            else
              doubleList.add(Double.parseDouble(match));

            if(mt == "")
              doubleList.add(null);
            else
              doubleList.add(Double.parseDouble(mt));
          } catch(Exception e) {
            e.printStackTrace();
            System.exit(-1);
          }

          if(key != "")
            map.put(key, doubleList);
          else{
            System.err.println("getTotalNbOfGoals - empty key");
            System.exit(-1);
          }
        }
        return map;
      }
      return null;
    }

    // Retoune le code source de la page selon le bout de URL indiqué
    public static String getCodeFromPage(String cutLink)
    {
        return getTextFile("https://www.betclic.fr/" + cutLink);
    }

    // Liste des liens à utiliser pour atteindre les pages de résultat double
    public static ArrayList<String> getLinksForResult()
    {
        String html = getTextFile(PAGE); // code de base
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

            if(debut != -1){

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
