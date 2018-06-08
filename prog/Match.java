import java.util.Date;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;

public class Match 
{
	private Date date;
	private String dom; // ville
	private String ext; // ville
	private Double coteN; // match nul
	private Double coteD; // victoire dom
	private Double coteE; // victoire ext

	private Integer domPoints;
	private Integer extPoints;
	private Integer journee;

	private Double coteDomNul;
	private Double coteDomExt;
	private Double coteExtNul;

	public SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
	public SimpleDateFormat hourDateFormat = new SimpleDateFormat("HH:mm dd/MM/yyyy");
	public DecimalFormat df = new DecimalFormat("#.00");

	public Match(Date d, String dom, String ext, double cn, double cd, double ce)
	{
		this.date = d;
		this.dom = dom;
		if(dom.contains("Paris SG"))
        {
            this.dom = "Paris";
        }
		this.ext = ext;
		if(ext.contains("Paris SG"))
        {
            this.ext = "Paris";
        }
		this.coteN = cn;
		this.coteD = cd;
		this.coteE = ce;

		this.domPoints = null;
		this.extPoints = null;
		this.journee = null;

		this.coteDomNul = null;
		this.coteDomExt = null;
		this.coteExtNul = null;

	}

	public Match(Date d, String dom, String ext, int domPoints, int extPoints, int journee)
	{
		this.date = d;
		this.dom = dom;
		if(dom.contains("Paris SG"))
        {
            this.dom = "Paris";
        }
		this.ext = ext;
		if(ext.contains("Paris SG"))
        {
            this.ext = "Paris";
        }
		this.coteN = null;
		this.coteD = null;
		this.coteE = null;

		this.domPoints = domPoints;
		this.extPoints = extPoints;
		this.journee = journee;

		this.coteDomNul = null;
		this.coteDomExt = null;
		this.coteExtNul = null;

	}

	public Match(String dom, String ext, double dn, double de, double en)
	{
		this.date = null;
		this.dom = dom;
		if(dom.contains("Paris SG"))
        {
            this.dom = "Paris";
        }
		this.ext = ext;
		if(ext.contains("Paris SG"))
        {
            this.ext = "Paris";
        }
		this.coteN = null;
		this.coteD = null;
		this.coteE = null;

		this.domPoints = null;
		this.extPoints = null;
		this.journee = null;

		this.coteDomNul = dn;
		this.coteDomExt = de;
		this.coteExtNul = en;

	}

	public Date getDate()
	{
		return this.date;
	}

	public String getDom()
	{
		return this.dom;
	}

	public String getExt()
	{
		return this.ext;
	}

	public double getCoteN()
	{
		return this.coteN;
	}

	public double getCoteD()
	{
		return this.coteD;
	}

	public double getCoteE()
	{
		return this.coteE;
	}

	public double getCoteDN()
        {
                return this.coteDomNul;
        }

        public double getCoteDE()
        {
                return this.coteDomExt;
        }

        public double getCoteNE()
        {
                return this.coteExtNul;
        }


	public int getDomPoints(){
		return this.domPoints;
	}

        public int getExtPoints(){
                return this.extPoints;
        }
        public int getJournee(){
                return this.journee;
        }

	public String checkNoResult(double c)
	{
		if(c == 0)
		{
			return "---";
		}
		return df.format(c);
	}

	public String toString()
	{
		if(domPoints == null && extPoints == null && journee == null && coteDomExt == null && coteDomNul == null && coteExtNul == null)
		{
			return dateFormat.format(this.date) + " : " + this.dom + " vs " + this.ext + " : " + checkNoResult(this.coteD) + " | " + checkNoResult(this.coteN) + " | " + checkNoResult(this.coteE);
		}
		else if(coteE == null && coteN == null && coteD == null && coteDomExt == null && coteDomNul == null && coteExtNul == null)
		{
			return "Journee " + String.format("%02d", this.journee) + " - " + hourDateFormat.format(this.date) + " : " + this.dom + " vs " + this.ext + " : " + this.domPoints + " . " + this.extPoints;
		}
		else if(domPoints == null && extPoints == null && journee == null && coteE == null && coteN == null && coteD == null)
		{
			return "" + this.dom + " vs " + this.ext + " : " + checkNoResult(this.coteDomNul) + " | " + checkNoResult(this.coteDomExt) + " | " + checkNoResult(this.coteExtNul);
		}

		System.err.println("Problème dans la conception du match : \ndomPoints = " + this.domPoints + "\nextPonits = " + this.extPoints + "\njournee = " + this.journee + "\ncoteD = " + this.coteD + "\ncoteN = " + this.coteN + "\ncoteE = " + this.coteE + "\ncoteDomNul = " + coteDomNul + "\ncoteDomExt = " + coteDomExt + "\ncoteExtNul = " + coteExtNul);
		System.exit(-1);

		return "";
	}
}
