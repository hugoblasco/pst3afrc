function actualise() {
	var numeroJour = document.getElementById("menujournee").selectedIndex + 1;
	matchs(numeroJour);
	classement(numeroJour);
	mult(numeroJour);
}

function requetematch(t1, t2, t3){
        var result;
        $.ajax({
                type: "GET",
                url: "shell.php?t1="+t1+"&t2="+t2+"&t3="+t3,
                dataType: "text",
                async: false,
                error: function(data){
                        alert("ERROR IN GETTING shell.php : " + data);
                },

                success: function(data){
                        result = data;
                }
        });

        return result;
}


function matchs(numeroJour){

var nbBloc;
var journee;
var nbMatch;
var equipeDom;
var equipeExt;
var butDom;
var butExt;
var dateM;
var coteDom;
var coteExt;
var coteNul;
var coteDomOuNul;
var coteDomOuExt;
var coteNulOuExt;
var resPropos;
var coteDE;  //DE correspond a domicile etoile
var coteEE;
var coteNE;
var coteDONE;
var coteDOEE;
var coteNOEE;
var antecedentDom;
var antecedentExt;

var nombreButEncaisseDom;
var nombreButEncaisseEXT;
var nombreButMarqueDom;
var nombreButMarqueExt;

var details;
var recu;
var res;

	var tmp;
	var toAdd = null;

var img1;
var img2;
var img;

recu = requetematch("infoMatchH",numeroJour,0);

//recu="1!!4--10--20:45 09/09/2016;;Paris;;Saint-Etienne;;1;;1;;1.350000;;9.500000;;4.500000;;0.960000;;1.090000;;2.820000;;1;;3;;1;;1;;4;;3;;1;;dvvee;;nvdee;;5;;3;;5;;4::17:00 10/09/2016;;Lyon;;Bordeaux;;1;;3;;1.620000;;5.100000;;4.000000;;1.070000;;1.140000;;2.080000;;4;;2;;1;;1;;4;;3;;2;;dvvee;;vdvee;;7;;4;;5;;6::20:00 10/09/2016;;Lille;;Monaco;;1;;4;;2.350000;;3.250000;;3.100000;;1.250000;;1.270000;;1.480000;;3;;1;;1;;2;;3;;2;;3;;nvdee;;vvnee;;4;;4;;6;;3::20:00 10/09/2016;;Lorient;;Nancy;;0;;2;;2.400000;;3.000000;;3.100000;;1.240000;;1.220000;;1.400000;;4;;1;;1;;1;;1;;1;;1;;dddee;;dddee;;2;;8;;0;;7::20:00 10/09/2016;;Bastia;;Toulouse;;2;;1;;2.900000;;2.600000;;2.800000;;1.290000;;1.240000;;1.220000;;3;;1;;1;;2;;3;;2;;3;;dvdee;;nvnee;;3;;3;;4;;1::20:00 10/09/2016;;Guingamp;;Montpellier;;1;;1;;2.350000;;3.200000;;3.200000;;1.270000;;1.270000;;1.500000;;3;;2;;1;;2;;3;;2;;2;;vvnee;;ndvee;;6;;3;;3;;4::20:00 10/09/2016;;Angers;;Dijon;;3;;1;;2.200000;;3.500000;;3.000000;;1.160000;;1.240000;;1.480000;;4;;1;;1;;1;;1;;1;;1;;dddee;;vddee;;0;;4;;4;;4::15:00 11/09/2016;;Nantes;;Metz;;0;;3;;1.700000;;5.250000;;3.500000;;1.060000;;1.190000;;1.950000;;4;;1;;1;;1;;1;;1;;1;;ddvee;;vdvee;;1;;2;;5;;5::17:00 11/09/2016;;Rennes;;Caen;;2;;0;;2.050000;;3.600000;;3.300000;;1.170000;;1.200000;;1.590000;;4;;2;;1;;1;;3;;3;;2;;nvdee;;vdvee;;3;;2;;5;;4::20:45 11/09/2016;;Nice;;Marseille;;3;;2;;2.150000;;3.400000;;3.300000;;1.210000;;1.220000;;1.550000;;4;;2;;1;;2;;3;;2;;2;;nvvee;;vdnee;;3;;1;;3;;2";

res = recu.split("!!");
nbBloc = parseInt(res[0]);

recu = res[1].split("++");

for(i=0;i<nbBloc;i++)
	{
		res = recu[i].split("--");
		journee = parseInt(res[0]);

		if(document.getElementById("infoMatchJournee"+i+"row1")!=null){ 
			document.getElementById("infoMatchJournee"+i+"row1").parentNode.removeChild(document.getElementById("infoMatchJournee"+i+"row1"));
		}
		toAdd = document.createElement("div");
		toAdd.className = "row";
		toAdd.id = "infoMatchJournee"+i+"row1";
		document.getElementById("matchs").appendChild(toAdd);

		toAdd = document.createElement("div");
		toAdd.className = "col-md-12";
		toAdd.id = "infoMatchJournee"+i+"col1";
		document.getElementById("infoMatchJournee"+i+"row1").appendChild(toAdd);

		toAdd = document.createElement("div");
		toAdd.setAttribute("style","border:1px solid white;");
		toAdd.id = "infoMatchJournee"+i+"divMaster";
		document.getElementById("infoMatchJournee"+i+"col1").appendChild(toAdd);

		toAdd = document.createElement("a");
		toAdd.id = "infoMatchJournee"+i;
		toAdd.innerHTML = "Journée "+journee;
		toAdd.className = "btn btn-default btn-block prop";
		toAdd.setAttribute("data-toggle","collapse");
		toAdd.setAttribute("aria-expanded","false");
		toAdd.setAttribute("aria-controls","infoMatchJournee"+i+"div");
		toAdd.setAttribute("role","button");
		toAdd.setAttribute("href","#infoMatchJournee"+i+"div");
		document.getElementById("infoMatchJournee"+i+"divMaster").appendChild(toAdd);
		
		toAdd = document.createElement("div");
		toAdd.className = "collapse in";
		toAdd.id = "infoMatchJournee"+i+"div";
		document.getElementById("infoMatchJournee"+i+"divMaster").appendChild(toAdd);

		nbMatch = parseInt(res[1]);
		
		res = res[2].split("::");
		for(j=0;j<nbMatch;j++)
			{
				details = res[j].split(";;");
				dateM = details[0]; // recu en mode string
				equipeDom = details[1];
				equipeExt = details[2];
				butDom = parseInt(details[3]); //si -1 ca veur dire qu il n y a pas de resultat
				butExt = parseInt(details[4]);
				coteDom = parseFloat(details[5]);
				coteExt = parseFloat(details[6]);
				coteNul = parseFloat(details[7]);
				coteDomOuNul = parseFloat(details[8]);
				coteDomOuExt = parseFloat(details[9]);
				coteNulOuExt = parseFloat(details[10]);
				resPropos = parseInt(details[11]); // 1 - 6 valeur, correspond à D, E, N, DN, DE, NE
				coteDE = parseInt(details[12]);
				coteEE = parseInt(details[13]);
				coteNE = parseInt(details[14]);
				coteDONE = parseInt(details[15]);
				coteDOEE = parseInt(details[16]);
				coteNOEE = parseInt(details[17]);
				antecedentDom = details[18]; // V=victoire, D=defaite, N=nul E=pas joué
				antecedentExt = details[19];
				nombreButMarqueDom = parseInt(details[20]);
				nombreButEncaisseDom = parseInt(details[21]);
				nombreButMarqueExt = parseInt(details[22]);
				nombreButEncaisseExt = parseInt(details[23]);

img1=document.createElement("img");
img1.src="assets/img/"+equipeDom+".png";
img1.className="image";
img2=document.createElement("img");
img2.src="assets/img/"+equipeExt+".png";
img2.className="image";

							toAdd = document.createElement("div");
							toAdd.id = "infoMatchJournee"+i+"-"+j+"divMaster";
							toAdd.setAttribute("style","border:1px solid white;");
							document.getElementById("infoMatchJournee"+i+"div").appendChild(toAdd);

							toAdd = document.createElement("a");
							toAdd.id = "infoMatchJournee"+i+"-"+j;
							toAdd.className = "btn btn-default btn-block small-screen";
							toAdd.setAttribute("data-toggle","collapse");
							toAdd.setAttribute("aria-expanded","false");
							toAdd.setAttribute("aria-controls","infoMatchJournee"+i+"-"+j+"divcoll");
							toAdd.setAttribute("role","button");
							toAdd.setAttribute("href","#infoMatchJournee"+i+"-"+j+"divcoll");
							document.getElementById("infoMatchJournee"+i+"-"+j+"divMaster").appendChild(toAdd);

							toAdd = document.createElement("table");
							toAdd.id = "matchtable"+i+"-"+j;
							toAdd.setAttribute("width","100%");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("style","height:1px");
							document.getElementById("infoMatchJournee"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "matchtr"+i+"-"+j;
							document.getElementById("matchtable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "matchtd1-"+i+"-"+j;
							toAdd.setAttribute("width","10%");
							document.getElementById("matchtr"+i+"-"+j).appendChild(toAdd);
							document.getElementById("matchtd1-"+i+"-"+j).appendChild(img1);

							toAdd = document.createElement("td");
							toAdd.id = "matchtd2-"+i+"-"+j;
							document.getElementById("matchtr"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "matchtd3-"+i+"-"+j;
							toAdd.setAttribute("width","10%");
							document.getElementById("matchtr"+i+"-"+j).appendChild(toAdd);
							document.getElementById("matchtd3-"+i+"-"+j).appendChild(img2);

							toAdd = document.createElement("table");
							toAdd.id = "matchtablemil-"+i+"-"+j;
							toAdd.setAttribute("align","center");
							document.getElementById("matchtd2-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "matchtrmil1-"+i+"-"+j;
							document.getElementById("matchtablemil-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "matchtrmil2-"+i+"-"+j;
							document.getElementById("matchtablemil-"+i+"-"+j).appendChild(toAdd);

                                                        toAdd = document.createElement("tr");
                                                        toAdd.id = "matchtrmil3-"+i+"-"+j;
                                                        document.getElementById("matchtablemil-"+i+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("td");
							toAdd.id = "matchtdmil1-"+i+"-"+j;
							toAdd.innerHTML = equipeDom+" - "+equipeExt;
							document.getElementById("matchtrmil1-"+i+"-"+j).appendChild(toAdd);
														if(butDom == "-1" || butExt == "-1") {
															toAdd = document.createElement("td");
	                                                        toAdd.id = "matchtdmil2-"+i+"-"+j;
	                                                        toAdd.innerHTML = "Non joué";
	                                                        document.getElementById("matchtrmil2-"+i+"-"+j).appendChild(toAdd);
														}
														else {
	                                                        toAdd = document.createElement("td");
	                                                        toAdd.id = "matchtdmil2-"+i+"-"+j;
	                                                        toAdd.innerHTML = "( "+butDom+" - "+butExt+" )";
	                                                        document.getElementById("matchtrmil2-"+i+"-"+j).appendChild(toAdd);
                                                    	}


							toAdd = document.createElement("td");
							toAdd.id = "matchtdmil2-"+i+"-"+j;
							toAdd.innerHTML = dateM;
							document.getElementById("matchtrmil3-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("div");
							toAdd.id = "infoMatchJournee"+i+"-"+j+"divcoll";
							toAdd.className = "collapse";
							document.getElementById("infoMatchJournee"+i+"-"+j+"divMaster").appendChild(toAdd);

							toAdd = document.createElement("div");
							toAdd.id = "infoMatchJournee"+i+"-"+j+"div";
							toAdd.className = "btn btn-default btn-block block-info";
							document.getElementById("infoMatchJournee"+i+"-"+j+"divcoll").appendChild(toAdd);

							toAdd = document.createElement("table");
							toAdd.id = "infoMatchJourneetable"+i+"-"+j;
							toAdd.setAttribute("width","100%");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("style","height:1px");
							document.getElementById("infoMatchJournee"+i+"-"+j+"div").appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.setAttribute("style","height:50px;vertical-align:middle;");
							toAdd.id = "infoMatchJourneecons1-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneecons2-"+i+"-"+j;
							toAdd.setAttribute("style","height:45px;vertical-align:top;");
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdconstitle-"+i+"-"+j;
							toAdd.innerHTML = "Notre Pronostic:";
							toAdd.setAttribute("style","font-weight:bold;border-top:3px solid white;");
							toAdd.setAttribute("colspan","12");
							document.getElementById("infoMatchJourneecons1-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdconstext-"+i+"-"+j;
							switch(resPropos){
							case 1:
							toAdd.innerHTML = "<I>Victoire de "+equipeDom+"</I>";
							break;
							case 2:
							toAdd.innerHTML = "<I>Victoire de "+equipeExt+"</I>";
							break;
							case 3:
							toAdd.innerHTML = "<I>Match Nul</I>";
							break;
							case 4:
							toAdd.innerHTML = "<I>"+equipeDom+" ou Match Nul</I>";
							break;
							case 5:
							toAdd.innerHTML = "<I>"+equipeDom+" ou "+equipeExt+"</I>";
							break;
							case 6:
							toAdd.innerHTML = "<I>"+equipeExt+" ou Match Nul</I>";
							break;
							}
							toAdd.setAttribute("colspan","12");
							document.getElementById("infoMatchJourneecons2-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.setAttribute("style","height:50px;vertical-align:middle;");
							toAdd.id = "infoMatchJourneetr1-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr2-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd1-"+i+"-"+j;
							toAdd.innerHTML = "Cotes résultats simples";
							toAdd.setAttribute("style","font-weight:bold;border-top:3px solid white;");
							toAdd.setAttribute("colspan","12");
							document.getElementById("infoMatchJourneetr1-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd2-"+i+"-"+j;
							toAdd.innerHTML = "<I>"+equipeDom+"</I>";
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr2-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd3-"+i+"-"+j;
							toAdd.innerHTML = "<I>Match Nul</I>";;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","34%");
							document.getElementById("infoMatchJourneetr2-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd4-"+i+"-"+j;
							toAdd.innerHTML = "<I>"+equipeExt+"</I>";;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr2-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr3-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd5-"+i+"-"+j;
                                                        if(coteDom>1){
                                                                toAdd.innerHTML = coteDom;
                                                        }else{
                                                                toAdd.innerHTML = "---";
                                                        }
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr3-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd6-"+i+"-"+j;
                                                        if(coteNul>1){
                                                                toAdd.innerHTML = coteNul;
                                                        }else{
                                                                toAdd.innerHTML = "---";
                                                        }
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","34%");
							document.getElementById("infoMatchJourneetr3-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd7-"+i+"-"+j;
                                                        if(coteExt>1){
                                                                toAdd.innerHTML = coteExt;
                                                        }else{
                                                                toAdd.innerHTML = "---";
                                                        }
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr3-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr4-"+i+"-"+j;
							toAdd.setAttribute("style","height:45px;vertical-align:top;");
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

img=document.createElement("img");
img.src="assets/img/Etoile"+coteDE+".png";
img.className="star";

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd8-"+i+"-"+j;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr4-"+i+"-"+j).appendChild(toAdd);
							document.getElementById("infoMatchJourneetd8-"+i+"-"+j).appendChild(img);

img=document.createElement("img");
img.src="assets/img/Etoile"+coteNE+".png";
img.className="star";

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd9-"+i+"-"+j;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","34%");
							document.getElementById("infoMatchJourneetr4-"+i+"-"+j).appendChild(toAdd);
							document.getElementById("infoMatchJourneetd9-"+i+"-"+j).appendChild(img);

img=document.createElement("img");
img.src="assets/img/Etoile"+coteEE+".png";
img.className="star";

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd10-"+i+"-"+j;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr4-"+i+"-"+j).appendChild(toAdd);

							document.getElementById("infoMatchJourneetd10-"+i+"-"+j).appendChild(img);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr5-"+i+"-"+j;
							toAdd.setAttribute("style","height:50px;vertical-align:middle;");
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr6-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd11-"+i+"-"+j;
							toAdd.innerHTML = "Cotes résultats doubles";
							toAdd.setAttribute("colspan","12");
							toAdd.setAttribute("style","font-weight:bold;border-top:3px solid white;");
							document.getElementById("infoMatchJourneetr5-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd12-"+i+"-"+j;
							toAdd.innerHTML = "<I>"+equipeDom+"</I>";;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr6-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd13-"+i+"-"+j;
							toAdd.innerHTML = "<I>"+equipeDom+"</I>";;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","34%");
							document.getElementById("infoMatchJourneetr6-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd14-"+i+"-"+j;
							toAdd.innerHTML = "<I>"+equipeExt+"</I>";;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr6-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr6bis-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd12bis-"+i+"-"+j;
							toAdd.innerHTML = "<I>/ Match Nul</I>";
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr6bis-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd13bis-"+i+"-"+j;
							toAdd.innerHTML = "<I>/ "+equipeExt+"</I>";;
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","34%");
							document.getElementById("infoMatchJourneetr6bis-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd14bis-"+i+"-"+j;
							toAdd.innerHTML = "<I>/ Match Nul</I>";
							toAdd.setAttribute("colspan","4");
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr6bis-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr7-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd15-"+i+"-"+j;
							toAdd.setAttribute("colspan","4");
                                                        if(coteDomOuNul>1){
                                                                toAdd.innerHTML = coteDomOuNul;
                                                        }else{
                                                                toAdd.innerHTML = "---";
                                                        }
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr7-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd16-"+i+"-"+j;
							toAdd.setAttribute("colspan","4");
                                                        if(coteDomOuExt>1){
                                                                toAdd.innerHTML = coteDomOuExt;
                                                        }else{
                                                                toAdd.innerHTML = "---";
                                                        }
							toAdd.setAttribute("width","34%");
							document.getElementById("infoMatchJourneetr7-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd17-"+i+"-"+j;
							toAdd.setAttribute("colspan","4");
                                                        if(coteNulOuExt>1){
                                                                toAdd.innerHTML = coteNulOuExt;
                                                        }else{
                                                                toAdd.innerHTML = "---";
                                                        }
							toAdd.setAttribute("width","33%");
							document.getElementById("infoMatchJourneetr7-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr8-"+i+"-"+j;
							toAdd.setAttribute("style","height:45px;vertical-align:top;");
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

img=document.createElement("img");
img.src="assets/img/Etoile"+coteDONE+".png";
img.className="star";

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd18-"+i+"-"+j;
							toAdd.setAttribute("width","33%");
							toAdd.setAttribute("colspan","4");
							document.getElementById("infoMatchJourneetr8-"+i+"-"+j).appendChild(toAdd);
							document.getElementById("infoMatchJourneetd18-"+i+"-"+j).appendChild(img);

img=document.createElement("img");
img.src="assets/img/Etoile"+coteDOEE+".png";
img.className="star";

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd19-"+i+"-"+j;
							toAdd.setAttribute("width","34%");
							toAdd.setAttribute("colspan","4");
							document.getElementById("infoMatchJourneetr8-"+i+"-"+j).appendChild(toAdd);
							document.getElementById("infoMatchJourneetd19-"+i+"-"+j).appendChild(img);

img=document.createElement("img");
img.src="assets/img/Etoile"+coteNOEE+".png";
img.className="star";

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetd20-"+i+"-"+j;
							toAdd.setAttribute("width","33%");
							toAdd.setAttribute("colspan","4");
							document.getElementById("infoMatchJourneetr8-"+i+"-"+j).appendChild(toAdd);

							document.getElementById("infoMatchJourneetd20-"+i+"-"+j).appendChild(img);

							toAdd = document.createElement("tr");
							toAdd.setAttribute("style","vertical-align:middle;height:50px;");
							toAdd.id = "infoMatchJourneetr9title-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdanttitle-"+i+"-"+j;
							toAdd.innerHTML = "Les 5 derniers matchs:";
							toAdd.setAttribute("colspan","12");
							toAdd.setAttribute("style","font-weight:bold;border-top:3px solid white;");
							document.getElementById("infoMatchJourneetr9title-"+i+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr9-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.setAttribute("style","height:45px;vertical-align:middle;");
							toAdd.id = "infoMatchJourneetddommaster-"+i+"-"+j;
							toAdd.setAttribute("colspan","6");
							document.getElementById("infoMatchJourneetr9-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.setAttribute("style","height:45px;vertical-align:middle;");
							toAdd.id = "infoMatchJourneetdextmaster-"+i+"-"+j;
							toAdd.setAttribute("colspan","6");
							document.getElementById("infoMatchJourneetr9-"+i+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("table");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("width","50%");
							toAdd.id = "infoMatchJourneetableresdom-"+i+"-"+j;
							document.getElementById("infoMatchJourneetddommaster-"+i+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetrdom-"+i+"-"+j;
							document.getElementById("infoMatchJourneetableresdom-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetddom1-"+i+"-"+j;
							if(antecedentDom.charAt(0)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(0)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(0)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrdom-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetddom2-"+i+"-"+j;
							if(antecedentDom.charAt(1)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(1)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(1)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrdom-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetddom3-"+i+"-"+j;
							if(antecedentDom.charAt(2)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(2)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(2)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrdom-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetddom4-"+i+"-"+j;
							if(antecedentDom.charAt(3)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(3)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(3)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrdom-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetddom5-"+i+"-"+j;
							if(antecedentDom.charAt(4)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(4)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentDom.charAt(4)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrdom-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("table");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("width","50%");
							toAdd.id = "infoMatchJourneetableresext-"+i+"-"+j;
							document.getElementById("infoMatchJourneetdextmaster-"+i+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetrext-"+i+"-"+j;
							document.getElementById("infoMatchJourneetableresext-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdext1-"+i+"-"+j;
							if(antecedentExt.charAt(0)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(0)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(0)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrext-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdext2-"+i+"-"+j;
							if(antecedentExt.charAt(1)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(1)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(1)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrext-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdext3-"+i+"-"+j;
							if(antecedentExt.charAt(2)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(2)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(2)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrext-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdext4-"+i+"-"+j;
							if(antecedentExt.charAt(3)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(3)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(3)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrext-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdext5-"+i+"-"+j;
							if(antecedentExt.charAt(4)=='v'){
							toAdd.innerHTML = "V";
							toAdd.setAttribute("style","color:white;background-color:rgb(0,200,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(4)=='d'){
							toAdd.innerHTML = "D";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,0,0);font-weight:bold;");
							}else{
							if(antecedentExt.charAt(4)=='n'){
							toAdd.innerHTML = "N";
							toAdd.setAttribute("style","color:white;background-color:rgb(200,180,0);font-weight:bold;");
							}else{
							toAdd.innerHTML = "X";
							toAdd.setAttribute("style","color:white;background-color:rgb(100,100,100);font-weight:bold;");
							}
							}
							}
							document.getElementById("infoMatchJourneetrext-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr10-"+i+"-"+j;
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdbpdom-"+i+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.innerHTML = "<I>Buts pour:</I><B> "+nombreButMarqueDom+"</B>";
							document.getElementById("infoMatchJourneetr10-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdbpext-"+i+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.innerHTML = "<I>Buts pour:</I><B> "+nombreButMarqueExt+"</B>";
							document.getElementById("infoMatchJourneetr10-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoMatchJourneetr11-"+i+"-"+j;
							toAdd.setAttribute("style","height:45px;vertical-align:top;");
							document.getElementById("infoMatchJourneetable"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdbcdom-"+i+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.setAttribute("style","border-bottom:3px solid white;");
							toAdd.innerHTML = "<I>Buts contre:</I><B> "+nombreButEncaisseDom+"</B>";
							document.getElementById("infoMatchJourneetr11-"+i+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoMatchJourneetdbcext-"+i+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.setAttribute("style","border-bottom:3px solid white;");
							toAdd.innerHTML = "<I>Buts contre:</I><B> "+nombreButEncaisseExt+"</B>";
							document.getElementById("infoMatchJourneetr11-"+i+"-"+j).appendChild(toAdd);


			}
			
	}

}
