function requetemult(t1, t2, t3){
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


function mult(numeroJour)
{

var mise;
var gainSouhait;

var nbBloc;
var numeroJour;
var nbEtoileBloc;
var gainPotBloc;
var propos;
var nbMatch;
var nbEtoileMatch;
var equipeDom;
var equipeExt;
var dateM;
var resPropos;
var antecedentDom;
var antecedentExt;
var nombreButEncaisseDom;
var nombreButEncaisseEXT;
var nombreButMarqueDom;
var nombreButMarqueExt;

var details;
var recu;

	var total;

	var tmp;
	var toAdd = null;
var img1;
var img2;

for(tmp=0;tmp<30;tmp++) {
	for(j=0;j<30;j++) {
		if(document.getElementById("infoPropMatch"+tmp+"-"+j+"divMaster")!=null) {
			document.getElementById("infoPropMatch"+tmp+"-"+j+"divMaster").parentNode.removeChild(document.getElementById("infoPropMatch"+tmp+"-"+j+"divMaster"));
		}
	}
}

//numeroJour=document.getElementById("menujournee").selectedIndex + 1;

	total = requetemult("propMatchH",numeroJour,0);
//total="3!!3--2.800000--1--20:00 10/09/2016;;Bastia;;Toulouse;;3;;2;;dvdee;;nvnee;;3;;3;;4;;1++3--3.100000--1--20:00 10/09/2016;;Lille;;Monaco;;3;;2;;nvdee;;vvnee;;4;;4;;6;;3++3--2.150000--1--20:45 11/09/2016;;Nice;;Marseille;;1;;2;;nvvee;;vdnee;;3;;1;;3;;2$$3!!2--5.100000--1--17:00 10/09/2016;;Lyon;;Bordeaux;;2;;1;;dvvee;;vdvee;;7;;4;;5;;6++1--5.022000--2--17:00 10/09/2016;;Lyon;;Bordeaux;;1;;3;;dvvee;;vdvee;;7;;4;;5;;6::20:00 10/09/2016;;Lille;;Monaco;;3;;2;;nvdee;;vvnee;;4;;4;;6;;3++1--9.500000--1--20:45 09/09/2016;;Paris;;Saint-Etienne;;2;;1;;dvvee;;nvdee;;5;;3;;5;;4$$3!!1--10.230000--2--20:00 10/09/2016;;Lille;;Monaco;;3;;2;;nvdee;;vvnee;;4;;4;;6;;3::20:45 11/09/2016;;Nice;;Marseille;;3;;2;;nvvee;;vdnee;;3;;1;;3;;2++1--10.560000--2--20:00 10/09/2016;;Guingamp;;Montpellier;;3;;2;;vvnee;;ndvee;;6;;3;;3;;4::20:45 11/09/2016;;Nice;;Marseille;;3;;2;;nvvee;;vdnee;;3;;1;;3;;2++1--10.230000--2--20:00 10/09/2016;;Lille;;Monaco;;3;;2;;nvdee;;vvnee;;4;;4;;6;;3::17:00 11/09/2016;;Rennes;;Caen;;3;;2;;nvdee;;vdvee;;3;;2;;5;;4";
	total = total.split("$$");
	for(k=0;k<3;k++)
		{
			recu = total[k];
			res = recu.split("!!");
			nbBloc = parseInt(res[0]);

			recu = res[1].split("++");

			for(i=0;i<nbBloc;i++)
				{
					res = recu[i].split("--");
					nbEtoileBloc = parseInt(res[0]);			
					gainPotBloc = parseFloat(res[1]);
					tmp=k*3+i+1;

					img=document.createElement("img");
					img.src="assets/img/Etoile"+nbEtoileBloc+".png";
					img.setAttribute("style","vertical-align:top;");
					img.width=120;
					img.height=24;

					if(document.getElementById("infoProptable"+tmp)!=null) {
						document.getElementById("infoProptable"+tmp).parentNode.removeChild(document.getElementById("infoProptable"+tmp));
					}
					
					if(document.getElementById("collapse-"+tmp)!=null) document.getElementById("collapse-"+tmp).parentNode.removeChild(document.getElementById("collapse-"+tmp));
					
					toAdd = toAdd = document.createElement("div");
					toAdd.id = "collapse-"+tmp;
					toAdd.className = "collapse";
					document.getElementById("div"+tmp).appendChild(toAdd);
					
					toAdd = document.createElement("table");
					toAdd.id = "infoProptable"+tmp;
					toAdd.setAttribute("width","100%");
					toAdd.setAttribute("align","center");
					toAdd.setAttribute("style","height:1px");
					document.getElementById("collapseP"+tmp).appendChild(toAdd);

					toAdd = document.createElement("tr");
					toAdd.id = "infoProptr1-"+tmp;
					document.getElementById("infoProptable"+tmp).appendChild(toAdd);

					toAdd = document.createElement("tr");
					toAdd.id = "infoProptr2-"+tmp;
					document.getElementById("infoProptable"+tmp).appendChild(toAdd);

					toAdd = document.createElement("td");
					toAdd.id = "infoProptd1-"+tmp;
					toAdd.innerHTML = "Probabilité:";
					toAdd.setAttribute("style","text-align:center;font-size:75%;");
					document.getElementById("infoProptr1-"+tmp).appendChild(toAdd);

					toAdd = document.createElement("td");
					toAdd.id = "infoProptd2-"+tmp;
					toAdd.setAttribute("style","text-align:center;padding-top:12px;");
					document.getElementById("infoProptr2-"+tmp).appendChild(toAdd);
					document.getElementById("infoProptd2-"+tmp).appendChild(img);

					toAdd = document.createElement("td");
					toAdd.id = "infoProptd3-"+tmp;
					toAdd.innerHTML = "Multiplicateur:";
					toAdd.setAttribute("style","text-align:center;font-size:75%;");
					document.getElementById("infoProptr1-"+tmp).appendChild(toAdd);

					toAdd = document.createElement("td");
					toAdd.id = "infoProptd4-"+tmp;
					toAdd.className = "infoprotd4"
					toAdd.innerHTML = "X "+gainPotBloc;
					document.getElementById("infoProptr2-"+tmp).appendChild(toAdd);

					nbMatch = parseInt(res[2]);

					res = res[3].split("::");
					for(j=0;j<nbMatch;j++)
						{
							details = res[j].split(";;");
							dateM = details[0]; // recu en mode string
							equipeDom = details[1];
							equipeExt = details[2];
							resPropos = parseInt(details[3]); // 1 - 6 valeur, correspond à D, E, N, DN, DE, NE
							nbEtoileMatch = parseInt(details[4]);
							antecedentDom = details[5]; // V=victoire, D=defaite, N=nul E=pas joué
							antecedentExt = details[6];
							nombreButMarqueDom = parseInt(details[7]);
							nombreButEncaisseDom = parseInt(details[8]);
							nombreButMarqueExt = parseInt(details[9]);
							nombreButEncaisseExt = parseInt(details[10]);

img1=document.createElement("img");
img1.src="assets/img/"+equipeDom+".png";
img1.className="imageMult";
img2=document.createElement("img");
img2.src="assets/img/"+equipeExt+".png";
img2.className="imageMult";
img=document.createElement("img");
img.src="assets/img/Etoile"+nbEtoileMatch+".png";
img.setAttribute("style","vertical-align:top;");
img.className="starMult";
							
							toAdd = document.createElement("div");
							toAdd.id = "infoPropMatch"+tmp+"-"+j+"divMaster";
							toAdd.setAttribute("style","border:1px solid white;");
							document.getElementById("collapse-"+tmp).appendChild(toAdd);

							toAdd = document.createElement("a");
							toAdd.id = "infoPropMatch"+tmp+"-"+j;
							toAdd.className = "btn btn-default btn-block small-screen";
							toAdd.setAttribute("data-toggle","collapse");
							toAdd.setAttribute("aria-expanded","false");
							toAdd.setAttribute("aria-controls","infoPropMatch"+tmp+"-"+j+"divcoll");
							toAdd.setAttribute("role","button");
							toAdd.setAttribute("href","#infoPropMatch"+tmp+"-"+j+"divcoll");
							document.getElementById("infoPropMatch"+tmp+"-"+j+"divMaster").appendChild(toAdd);


							toAdd = document.createElement("table");
							toAdd.id = "proptable"+tmp+"-"+j;
							toAdd.setAttribute("width","100%");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("style","height:1px");
							document.getElementById("infoPropMatch"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "proptr"+tmp+"-"+j;
							document.getElementById("proptable"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "proptd1-"+tmp+"-"+j;
							toAdd.setAttribute("width","10%");
							document.getElementById("proptr"+tmp+"-"+j).appendChild(toAdd);
							document.getElementById("proptd1-"+tmp+"-"+j).appendChild(img1);

							toAdd = document.createElement("td");
							toAdd.id = "proptd2-"+tmp+"-"+j;
							document.getElementById("proptr"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "proptd3-"+tmp+"-"+j;
							toAdd.setAttribute("width","10%");
							document.getElementById("proptr"+tmp+"-"+j).appendChild(toAdd);
							document.getElementById("proptd3-"+tmp+"-"+j).appendChild(img2);

							toAdd = document.createElement("table");
							toAdd.id = "proptablemil-"+tmp+"-"+j;
							toAdd.setAttribute("align","center");
							document.getElementById("proptd2-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "proptrmil1-"+tmp+"-"+j;
							document.getElementById("proptablemil-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "proptrmil2-"+tmp+"-"+j;
							document.getElementById("proptablemil-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "proptrmil3-"+tmp+"-"+j;
							document.getElementById("proptablemil-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "proptdmil1-"+tmp+"-"+j;
							toAdd.innerHTML = equipeDom+" - "+equipeExt;
							document.getElementById("proptrmil1-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "proptdmil2-"+tmp+"-"+j;
							toAdd.innerHTML = dateM;
							toAdd.setAttribute("style","vertical-align:top;");
							document.getElementById("proptrmil2-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "proptdmil3-"+tmp+"-"+j;

							document.getElementById("proptrmil3-"+tmp+"-"+j).appendChild(toAdd);
							document.getElementById("proptdmil3-"+tmp+"-"+j).appendChild(img);

							toAdd = document.createElement("div");
							toAdd.id = "infoPropMatch"+tmp+"-"+j+"divcoll";
							toAdd.className = "collapse";
							document.getElementById("infoPropMatch"+tmp+"-"+j+"divMaster").appendChild(toAdd);

							toAdd = document.createElement("div");
							toAdd.id = "infoPropMatch"+tmp+"-"+j+"div";
							toAdd.className = "btn btn-default btn-block block-info";
							document.getElementById("infoPropMatch"+tmp+"-"+j+"divcoll").appendChild(toAdd);

							toAdd = document.createElement("table");
							toAdd.id = "infoPropMatchtable"+tmp+"-"+j;
							toAdd.setAttribute("width","100%");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("style","height:1px");
							document.getElementById("infoPropMatch"+tmp+"-"+j+"div").appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.setAttribute("style","height:50px;vertical-align:middle;");
							toAdd.id = "infoPropMatchcons1-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtable"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoPropMatchcons2-"+tmp+"-"+j;
							toAdd.setAttribute("style","height:45px;vertical-align:top;");
							document.getElementById("infoPropMatchtable"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdconstitle-"+tmp+"-"+j;
							toAdd.innerHTML = "Résultat:";
							toAdd.setAttribute("style","font-weight:bold;border-top:3px solid white;");
							toAdd.setAttribute("colspan","12");
							document.getElementById("infoPropMatchcons1-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdconstext-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchcons2-"+tmp+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("tr");
							toAdd.setAttribute("style","vertical-align:middle;height:50px;");
							toAdd.id = "infoPropMatchtr9title-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtable"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdanttitle-"+tmp+"-"+j;
							toAdd.innerHTML = "Les 5 derniers matchs:";
							toAdd.setAttribute("colspan","12");
							toAdd.setAttribute("style","font-weight:bold;border-top:3px solid white;");
							document.getElementById("infoPropMatchtr9title-"+tmp+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("tr");
							toAdd.id = "infoPropMatchtr9-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtable"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.setAttribute("style","height:45px;vertical-align:middle;");
							toAdd.id = "infoPropMatchtddommaster-"+tmp+"-"+j;
							toAdd.setAttribute("colspan","6");
							document.getElementById("infoPropMatchtr9-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.setAttribute("style","height:45px;vertical-align:middle;");
							toAdd.id = "infoPropMatchtdextmaster-"+tmp+"-"+j;
							toAdd.setAttribute("colspan","6");
							document.getElementById("infoPropMatchtr9-"+tmp+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("table");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("width","50%");
							toAdd.id = "infoPropMatchtableresdom-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtddommaster-"+tmp+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("tr");
							toAdd.id = "infoPropMatchtrdom-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtableresdom-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtddom1-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrdom-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtddom2-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrdom-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtddom3-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrdom-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtddom4-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrdom-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtddom5-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrdom-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("table");
							toAdd.setAttribute("align","center");
							toAdd.setAttribute("width","50%");
							toAdd.id = "infoPropMatchtableresext-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtdextmaster-"+tmp+"-"+j).appendChild(toAdd);


							toAdd = document.createElement("tr");
							toAdd.id = "infoPropMatchtrext-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtableresext-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdext1-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrext-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdext2-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrext-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdext3-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrext-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdext4-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrext-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdext5-"+tmp+"-"+j;
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
							document.getElementById("infoPropMatchtrext-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoPropMatchtr10-"+tmp+"-"+j;
							document.getElementById("infoPropMatchtable"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdbpdom-"+tmp+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.innerHTML = "<I>Buts pour:</I><B> "+nombreButMarqueDom+"</B>";
							document.getElementById("infoPropMatchtr10-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdbpext-"+tmp+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.innerHTML = "<I>Buts pour:</I><B> "+nombreButMarqueExt+"</B>";
							document.getElementById("infoPropMatchtr10-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("tr");
							toAdd.id = "infoPropMatchtr11-"+tmp+"-"+j;
							toAdd.setAttribute("style","height:45px;vertical-align:top;");
							document.getElementById("infoPropMatchtable"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdbcdom-"+tmp+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.setAttribute("style","border-bottom:3px solid white;");
							toAdd.innerHTML = "<I>Buts contre:</I><B> "+nombreButEncaisseDom+"</B>";
							document.getElementById("infoPropMatchtr11-"+tmp+"-"+j).appendChild(toAdd);

							toAdd = document.createElement("td");
							toAdd.id = "infoPropMatchtdbcext-"+tmp+"-"+j;
							toAdd.setAttribute("colspan","6");
							toAdd.setAttribute("style","border-bottom:3px solid white;");
							toAdd.innerHTML = "<I>Buts contre:</I><B> "+nombreButEncaisseExt+"</B>";
							document.getElementById("infoPropMatchtr11-"+tmp+"-"+j).appendChild(toAdd);

						}
				}
		}

}
