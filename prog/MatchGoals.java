import java.util.HashMap;
import java.util.ArrayList;

class MatchGoals{
    public String dom;
    public String ext;
    public HashMap<String, ArrayList<Double>> totalGoals;
    public HashMap<String, ArrayList<Double>> goalsForEchTeam;

    MatchGoals(String d, String e, HashMap<String, ArrayList<Double>> t, HashMap<String, ArrayList<Double>> g){
      if(d.contains("Paris"))
        dom = "Paris";
      else
        dom = d;

      if(e.contains("Paris"))
        ext = "Paris";
      else
        ext = e;

      totalGoals = t;
      goalsForEchTeam = g;
    }

        public String getDom()
        {
                return this.dom;
        }

        public String getExt()
        {
                return this.ext;
        }


    public String toString(){
      return totalGoalsToString() + "\n" + goalsForEachTeamToString();
    }

    public String keyToString(int digit, String sign){
      String s = "";
      String key = sign + " de " + digit + ",5";
      ArrayList<Double> goals = totalGoals.get(key);
      s += key + " :";
      if(goals != null){
        // "parourir" la liste pour recuperer les buts
        int i = 0;
        for(Double d : goals){
          if(i != 0)
            s += " -";

          s += " " + d;
          i++;
        }
      }
      else
        s += " No data";

      s += "\n";

      return s;
    }

    public String totalGoalsToString(){
        String s = "";

        s += dom + " vs " + ext + "\n";

        if(totalGoals == null)
          return s + "No data";

        for(int i = 0; i<=5; i++){
          s += keyToString(i, "-");
        }
        s += "\n";
        for(int i = 0; i<=5; i++){
          s += keyToString(i, "+");
        }

        s += "\n";

        return s;
    }

    public String goalsForEachTeamToString(){
        String s = "";

        s += dom + " vs " + ext + "\n";

        if(goalsForEchTeam == null)
          return s + "No data";

        ArrayList<Double> goalsOui = goalsForEchTeam.get("oui");
        s += "oui :";

        if(goalsOui != null){
          int i = 0;
          for(Double d : goalsOui){
            if( i != 0)
              {s += " -";}

            s += " " + d;
            i++;
          }
        }
        else
          {s += " No data";}

        s += "\n";
        //goals.clear();

        ArrayList<Double> goalsNon = goalsForEchTeam.get("non");
        s += "non :";

        if(goalsNon != null){
          int i = 0;
          for(Double d : goalsNon){
            if(i != 0)
              s += " -";

            s += " " + d;
            i++;
          }
        }
        else
          s += " No data";

        s += "\n";
        return s;
    }
}
