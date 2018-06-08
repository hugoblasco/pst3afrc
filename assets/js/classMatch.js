function requeteclass(t1, t2, t3){
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


function classement(){

var nomEquipe;
var nbPts;
var nbMj;
var nbV;
var nbN;
var nbD;
var nbBP; //but pour
var nbBC; //but contre
var GA; // = BP - BC

var details;
var recu;
var img;
recu = requeteclass("classementV",0,0);

//recu="Monaco::86::35::27::5::3::98::29::69!!Paris::83::36::26::5::5::77::26::51!!Nice::77::35::22::11::2::59::29::30!!Lyon::60::35::19::3::13::71::42::29!!Bordeaux::57::36::15::12::9::51::41::10!!Marseille::55::35::15::10::10::53::39::14!!Saint-Etienne::50::35::12::14::9::40::32::8!!Nantes::48::35::13::9::13::34::47::-13!!Guingamp::47::36::13::8::15::44::49::-5!!Rennes::44::35::10::14::11::32::39::-7!!Lille::43::36::12::7::17::37::43::-6!!Toulouse::42::36::10::12::14::36::40::-4!!Metz::42::36::11::9::16::38::70::-32!!Angers::40::36::11::7::18::36::49::-13!!Montpellier::39::35::10::9::16::47::60::-13!!Caen::36::36::10::6::20::35::63::-28!!Lorient::35::36::10::5::21::43::67::-24!!Dijon::33::36::7::12::17::44::58::-14!!Nancy::32::36::8::8::20::26::49::-23!!Bastia::31::36::7::10::19::27::56::-29";

recu = recu.split("!!");

for(i=0;i<20;i++)
	{
		details = recu[i].split("::");
		nomEquipe = details[0];
		nbPts = parseInt(details[1]);
		nbMJ = parseInt(details[2]);
		nbV = parseInt(details[3]);
		nbN = parseInt(details[4]);
		nbD = parseInt(details[5]);
		nbBP = parseInt(details[6]);
		nbBC = parseInt(details[7]);
		GA = parseInt(details[8]);

img=document.createElement("img");
img.src="assets/img/"+nomEquipe+".png";
//img.setAttribute("style","float:left;");
img.width=30;
img.height=30;

		toAdd = document.createElement("tr");
		toAdd.id = "ligne"+i;
		toAdd.setAttribute("style","border:1px solid black;");
		document.getElementById("tableaubody").appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-1";
		toAdd.innerHTML = (i+1);
		toAdd.setAttribute("style","text-align:right;padding-right:5px;padding-left:5px;border:1px solid black;");
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-2img";
		toAdd.setAttribute("style","text-align:center;");
		document.getElementById("ligne"+i).appendChild(toAdd);
		document.getElementById("colonne"+i+"-2img").appendChild(img);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-2";
		toAdd.innerHTML = nomEquipe;
		toAdd.setAttribute("style","white-space: nowrap;text-align:left;padding-right:5px;border-top:1px solid black;");
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-3";
		toAdd.innerHTML = nbPts;
		toAdd.setAttribute("style","text-align:right;padding-right:5px;padding-left:5px;border:1px solid black;font-weight:bold;");
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-4";
		toAdd.innerHTML = nbMJ;
		toAdd.className = "classement";
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-5";
		toAdd.innerHTML = nbV;
		toAdd.className = "classement-cache";
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-6";
		toAdd.innerHTML = nbN;
		toAdd.className = "classement-cache";
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-7";
		toAdd.innerHTML = nbD;
		toAdd.className = "classement-cache";
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-8";
		toAdd.innerHTML = nbBP;
		toAdd.className = "classement";
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-9";
		toAdd.innerHTML = nbBC;
		toAdd.className = "classement";
		document.getElementById("ligne"+i).appendChild(toAdd);

		toAdd = document.createElement("td");
		toAdd.id = "colonne"+i+"-10";
		toAdd.innerHTML = GA;
		toAdd.className = "classement";
		document.getElementById("ligne"+i).appendChild(toAdd);

	}

}
