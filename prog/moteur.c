#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <mysql/mysql.h>

#define PCOTE 8
#define PNOTE 8
#define PSERIE 3
#define PBUTS 3

#define PROBA_MIN 0.55
#define ECART_PROBA_MIN 0.2

#define NDIF 3
#define BONUS_DOM 3

typedef struct _dateObjet{

	int h;
	int mn;
	int j;
	int m;
	int a;

}dateObjet;

typedef struct _totalButs{

	int dom;
	int ext;

}totalButs;

typedef struct _datafile{

	double gen[6];
	int note[2];
	int nbvic[2];
	int nbnul[2];
	int nbdef[2];
	int mar[2];
	int enc[2];

	double proba[3];

}datafile;

typedef struct _resultdata{

	int combi[30];
	double infos[30][2];
	double cote;
	double proba;

}resultdata;

typedef struct _equipe{

	int id;
	char nom[100];
	int pts;
	int mj;
	int v;
	int n;
	int d;
	int bp;
	int bc;
	int ga;

}equipe;

typedef struct _match{

	int id;
	int res;
	int etoiles;
	char date[100];
	char dom[100];
	char ext[100];
	char antdom[5];
	char antext[5];
	int bpdom;
	int bcdom;
	int bpext;
	int bcext;
	int id_dom;
	int id_ext;
	int bd;
	int be;
	double cdom;
	double cnul;
	double cext;
	double cdn;
	double cde;
	double cne;
	int edom;
	int enul;
	int eext;
	int edn;
	int ede;
	int ene;
	int journee;

}match;

typedef struct _pari{

	int id;
	int mult;
	int etoiles;
	double gains;
	int nbmatchs;
	match liste[30];

}pari;

int globale;

int proba_etoiles(double d, double n, double e, int res){

	switch(res){

		case 0:
			if(n==0){
				if(d>0.7) return 5;
				if(d>0.5)return 4;
				if(d>0.35)return 3;
				if(d>0.2)return 2;
				return 1;
			}
			if(d>0.7) return 5;
			if(d>0.5)return 4;
			if(d>0.35)return 3;
			if(d>0.22)return 2;
			return 1;
			break;

		case 1:
			if(d>0.7) return 5;
			if(d>0.5 && n<0.3 && e<0.3)return 4;
			if(d>0.35)return 3;
			if(d>0.2)return 2;
			return 1;
			break;

		case 2:
			if(e>0.7) return 5;
			if(e>0.5 && n<0.3 && d<0.3)return 4;
			if(e>0.35)return 3;
			if(e>0.2)return 2;
			return 1;
			break;

		case 3:
			if(n>0.7) return 5;
			if(n>0.5 && d<0.3 && e<0.3)return 4;
			if(n>0.35)return 3;
			if(n>0.2)return 2;
			return 1;
			break;

		case 4:
			if(d+n>0.7) return 5;
			if(d+n>0.5)return 4;
			if(d+n>0.35)return 3;
			if(d+n>0.2)return 2;
			return 1;
			break;

		case 5:
			if(d+e>0.7) return 5;
			if(d+e>0.5)return 4;
			if(d+e>0.35)return 3;
			if(d+e>0.2)return 2;
			return 1;
			break;

		case 6:
			if(e+n>0.7) return 5;
			if(e+n>0.5)return 4;
			if(e+n>0.35)return 3;
			if(e+n>0.2)return 2;
			return 1;
			break;

	}

	return 1;

}

dateObjet date_string_objet(char date[100]){

	char tmp[3];

	dateObjet res;

	sscanf(date,"%d%c%d%d%c%d%c%d",&res.h,&tmp[0],&res.mn,&res.j,&tmp[0],&res.m,&tmp[0],&res.a);

	return res;

}

int compare_date(char date1[100], char date2[100]){

	dateObjet d1 = date_string_objet(date1);
	dateObjet d2 = date_string_objet(date2);

	long long a = d1.mn+d1.h*60+d1.j*24*60+d1.m*31*24*60+d1.a*12*31*24*60;
	long long b = d2.mn+d2.h*60+d2.j*24*60+d2.m*31*24*60+d2.a*12*31*24*60;

	if(a<b){

		return -1;

	}else{

		if(a>b){

			return 1;

		}else{

			return 0;

		}

	}

	return 0;

}

int nombre_journees(int nbmatchs, match liste[30]){

	int i;

	int journee = liste[0].journee;

	int res = 1;

	for(i=1;i<nbmatchs;i++){

		if(liste[i].journee!=journee){
			res++;
			journee=liste[i].journee;
		}

	}

	return res;

}

int nombre_matchs_journee(int nbmatchs, match liste[30], int journee){

	int i;

	int res = 0;

	for(i=0;i<nbmatchs;i++){

		if(liste[i].journee==journee) res++;

	}

	return res;

}

double sqrt_n(double x){

	int i;

	double res=x;

	for(i=0;i<NDIF;i++){

		res=sqrt(res);

	}

	return res;

}

double factorielle(int n){

	int i;

	long int res = 1;

	for(i=1;i<=n;i++){

		res *= i;

	}

	return (double)(res);

}

void calcul_proba(int nbmatchs, totalButs total_buts, datafile data[nbmatchs]){

	int i,j,k;

	double kd;

	for(i=0;i<nbmatchs;i++){

		if(data[i].gen[0]!=0 && data[i].gen[1]!=0 && data[i].gen[2]!=0){

			double tmp;

			//calcul proba cotes

			double probacotes[3];

                        for(j=0;j<3;j++){

			probacotes[j] = 1/(((1/data[i].gen[0])+(1/data[i].gen[1])+(1/data[i].gen[2]))*(data[i].gen[j]));

			}

			//calcul proba notes gen

			double probanotes[3];

			for(j=0;j<3;j++){

				tmp=(data[i].note[0]-data[i].note[1]+BONUS_DOM);
				tmp=pow(tmp,3);
				kd = sqrt_n(fabs(tmp)/8000);

				switch(j){

					case 0:

						if(tmp>=0){

							probanotes[0]=(0.25)+kd*(0.75);

						}else{

							probanotes[0]=(0.25)-kd*(0.25);

						}

						break;

					case 1:

						probanotes[1]=(0.5)-kd*(0.5);

						break;

					case 2:

						if(tmp<=0){

							probanotes[2]=(0.25)+kd*(0.75);

						}else{

							probanotes[2]=(0.25)-kd*(0.25);

						}

						break;

				}

			}

			//calcul proba series matchs

			double probaseries[3];
			int nb = data[i].nbvic[0]+data[i].nbnul[0]+data[i].nbdef[0]+data[i].nbvic[1]+data[i].nbnul[1]+data[i].nbdef[1];

			for(j=0;j<3;j++){

				switch(j){

					default:
						break;

					case 0:

						if(nb>0){

							probaseries[0]=((double)(data[i].nbvic[0]+data[i].nbdef[1]))/nb;

						}else{

							probaseries[0]=0.33;

						}

						break;

					case 1:

						if(nb>0){

							probaseries[1]=((double)(data[i].nbnul[0]+data[i].nbnul[1]))/nb;

						}else{

							probaseries[1]=0.34;

						}

						break;

					case 2:

						if(nb>0){

							probaseries[2]=((double)(data[i].nbvic[1]+data[i].nbdef[0]))/nb;

						}else{

							probaseries[2]=0.33;

						}

						break;

				}

			}

			//calcul proba nb buts

			double probabuts[3];

			double moy_but_dom = ((double)(total_buts.dom))/380;
			double moy_but_ext = ((double)(total_buts.ext))/380;

			double force_attaque[2];
			double force_defense[2];

			force_attaque[0] = (((double)(data[i].mar[0]))/(19*moy_but_dom));
			force_defense[0] = (((double)(data[i].enc[0]))/(19*moy_but_ext));
			force_attaque[1] = (((double)(data[i].mar[1]))/(19*moy_but_ext));
			force_defense[1] = (((double)(data[i].enc[1]))/(19*moy_but_dom));

			double proba_nb_buts_dom[10];
			double proba_nb_buts_ext[10];

			if(data[i].mar[0] == 0 || data[i].mar[1] == 0 || data[i].enc[0] == 0 || data[i].enc[1] == 0){

				probabuts[0]=probabuts[2]=0.33;
				probabuts[1]=0.34;

			}else{

				for(j=0; j<10; j++){

					proba_nb_buts_dom[j]=exp(0-(force_attaque[0]*force_defense[1]*moy_but_dom))*pow(force_attaque[0]*force_defense[1]*moy_but_dom,j)/factorielle(j);

				}

				for(j=0; j<10; j++){

					proba_nb_buts_ext[j]=exp(0-(force_attaque[1]*force_defense[0]*moy_but_ext))*pow(force_attaque[1]*force_defense[0]*moy_but_ext,j)/factorielle(j);

				}

				probabuts[0] = probabuts[1] = probabuts[2] = 0;

				for(j=0;j<10;j++){

					for(k=0;k<10;k++){
						if(j>k){
							probabuts[0] += proba_nb_buts_dom[j] * proba_nb_buts_ext[k];
						}else{
							if(j==k){
								probabuts[1] += proba_nb_buts_dom[j] * proba_nb_buts_ext[k];
							}else{
								probabuts[2] += proba_nb_buts_dom[j] * proba_nb_buts_ext[k];
							}
						}

					}

				}

			}

			for(j=0;j<3;j++){

				data[i].proba[j] = (probacotes[j]*PCOTE + probanotes[j]*PNOTE + probaseries[j]*PSERIE + probabuts[j]*PBUTS) / (PCOTE + PNOTE + PSERIE + PBUTS);

			}

		}

	}

}

void save_result(int nbmatchs, totalButs total_buts, resultdata resultat[3], int combi[nbmatchs], datafile data[nbmatchs], double cote, double proba, int num){

	int i;
	resultdata tmp;

	for(i=1;i>=num;i--){

		memcpy(&resultat[i+1],&resultat[i],sizeof(resultdata));

	}

	tmp.cote=cote;
	tmp.proba=proba;

	for(i=0;i<nbmatchs;i++){

		tmp.combi[i]=combi[i];
		if(combi[i]>0){
			tmp.infos[i][0]=data[i].gen[combi[i]-1];
			tmp.infos[i][1]=data[i].proba[combi[i]-1];
		}else{
			tmp.infos[i][0]=0;
			tmp.infos[i][1]=0;
		}

	}

	memcpy(&resultat[num],&tmp,sizeof(resultdata));

}

void moteur(int nbmatchs, totalButs total_buts, double somme, double gains, resultdata resultat[3], datafile data[nbmatchs], int combi[nbmatchs]){

	int var[5][2];

	int max_equipes;

	int i,j,k,nbvar;

	double proba,cote;

	if(nbmatchs<5){

		max_equipes = nbmatchs;

	}else{

		max_equipes = 5;

	}

	for(nbvar=1;nbvar<=max_equipes;nbvar++){

		for(i=0;i<nbvar;i++){

			var[i][0] = i;
			var[i][1] = 1;

		}

		do{

			for(i=0;i<nbmatchs;i++){

				combi[i]=0;

			}

			for(i=0;i<nbvar;i++){

				combi[var[i][0]] = var[i][1];

			}

			proba=1;
			cote=1;

			for(k=0;k<nbmatchs;k++){

				if(combi[k]!=0){

					proba*=data[k].proba[combi[k]-1];
					cote*=data[k].gen[combi[k]-1];

				}

			}

			if(proba!=1 && cote !=1){

				for(k=0;k<3;k++){

					if(proba>resultat[k].proba && cote*somme>=gains){

						save_result(nbmatchs,total_buts,resultat,combi,data,cote,proba,k);
						k=3;

					}

				}

			}


			for(i=nbvar-1;i>=0;i--){

				var[i][1] ++;

				if(var[i][1] <=3){

					for(j=i+1;j<nbvar;j++){

						var[j][0] = var[i][0]+j-i;

					}

					i=-1;

				}else{

					var[i][1]=1;

					if(var[i][0] < nbmatchs-1){

						if(i==0 && var[i][0]>=nbmatchs-nbvar){

							i=-100;

						}else{

							if(i==0 || (i!=nbvar-1 && var[i][0]<var[i+1][0]-1) || i==nbvar-1){

								var[i][0]++;

								for(j=i+1;j<nbvar;j++){

									var[j][0] = var[i][0]+j-i;

								}

								i=-1;

							}

						}

					}else{

						if(i==0){

							i=-100;

						}

					}

				}

			}

		}while(i>-100);

	}

}

void classement_print(equipe clas[20]){

	int i;

	for(i=0;i<20;i++){

		printf("%s::%d::%d::%d::%d::%d::%d::%d::%d",clas[i].nom,clas[i].pts,clas[i].mj,clas[i].v,clas[i].n,clas[i].d,clas[i].bp,clas[i].bc,clas[i].ga);

		if(i!=19) printf("!!");

	}

}

void classement(MYSQL *con,int journee){

	int i,j,bd,be,id_dom,id_ext;

	char toopen[100];

	equipe clas[20];
	equipe tmp;

	MYSQL_RES *result;

	MYSQL_ROW row;

	for(i=0;i<20;i++){

		clas[i].id = i;
		clas[i].pts=clas[i].mj=clas[i].v=clas[i].n=clas[i].d=clas[i].bp=clas[i].bc=clas[i].ga=0;
		sprintf(toopen,"SELECT EQUIPE FROM EQUIPES WHERE ID = %d",i+1);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",clas[i].nom);
		mysql_free_result(result);

	}

	for(i=journee-1;i>0;i--){

		sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT,ID_DOM,ID_EXT FROM MATCHS WHERE JOURNEE = %d",i);
		mysql_query(con,toopen);
		result = mysql_store_result(con);

		for(j=0;j<10;j++){

			row = mysql_fetch_row(result);
			sscanf(row[0],"%d",&bd);
			sscanf(row[1],"%d",&be);
			sscanf(row[2],"%d",&id_dom);
			sscanf(row[3],"%d",&id_ext);

			if(bd!=-1 && be!=-1){

				clas[id_dom-1].mj++;
				clas[id_dom-1].bp+=bd;
				clas[id_dom-1].bc+=be;
				clas[id_dom-1].ga+=bd;
				clas[id_dom-1].ga-=be;
				clas[id_ext-1].mj++;
				clas[id_ext-1].bp+=be;
				clas[id_ext-1].bc+=bd;
				clas[id_ext-1].ga+=be;
				clas[id_ext-1].ga-=bd;

				if(bd>be){
					clas[id_dom-1].pts+=3;
					clas[id_dom-1].v++;
					clas[id_ext-1].pts+=0;
					clas[id_ext-1].d++;

				}else{
					if(bd<be){
						clas[id_dom-1].pts+=0;
						clas[id_dom-1].d++;
						clas[id_ext-1].pts+=3;
						clas[id_ext-1].v++;
					}else{
						clas[id_dom-1].pts+=1;
						clas[id_dom-1].n++;
						clas[id_ext-1].pts+=1;
						clas[id_ext-1].n++;
					}
				}

			}

		}

		mysql_free_result(result);

	}

	do{

		j=1;

		for(i=0;i<19;i++){

			if(clas[i].pts<clas[i+1].pts){

				j=0;
				memcpy(&tmp,&clas[i],sizeof(equipe));
				memcpy(&clas[i],&clas[i+1],sizeof(equipe));
				memcpy(&clas[i+1],&tmp,sizeof(equipe));

			}else{

				if(clas[i].pts==clas[i+1].pts){

					if(clas[i].ga<clas[i+1].ga){

						j=0;
						memcpy(&tmp,&clas[i],sizeof(equipe));
						memcpy(&clas[i],&clas[i+1],sizeof(equipe));
						memcpy(&clas[i+1],&tmp,sizeof(equipe));

					}else{

						if(clas[i].ga==clas[i+1].ga){

							if(clas[i].bp<clas[i+1].bp){

								j=0;
								memcpy(&tmp,&clas[i],sizeof(equipe));
								memcpy(&clas[i],&clas[i+1],sizeof(equipe));
								memcpy(&clas[i+1],&tmp,sizeof(equipe));

							}

						}

					}

				}

			}

		}

	}while(j==0);

	classement_print(clas);

}

void classementH(MYSQL *con,int journee){

	classement(con,journee);

}

void classementV(MYSQL *con){

	classement(con,39);

}

void pariPerso_print(pari p[3]){

	int i,j;

	printf("3!!");

	for(i=0;i<3;i++){

		printf("%d--%lf--%d--",p[i].etoiles,p[i].gains,p[i].nbmatchs);

		for(j=0;j<p[i].nbmatchs;j++){

			printf("%s;;%s;;%s;;%d;;%d;;%c%c%c%c%c;;%c%c%c%c%c;;%d;;%d;;%d;;%d",p[i].liste[j].date,p[i].liste[j].dom,p[i].liste[j].ext,p[i].liste[j].res,p[i].liste[j].etoiles,p[i].liste[j].antdom[0],p[i].liste[j].antdom[1],p[i].liste[j].antdom[2],p[i].liste[j].antdom[3],p[i].liste[j].antdom[4],p[i].liste[j].antext[0],p[i].liste[j].antext[1],p[i].liste[j].antext[2],p[i].liste[j].antext[3],p[i].liste[j].antext[4],p[i].liste[j].bpdom,p[i].liste[j].bcdom,p[i].liste[j].bpext,p[i].liste[j].bcext);

			if(j!=p[i].nbmatchs-1) printf("::");

		}

		if(i!=2) printf("++");

	}

}

void pariPerso(MYSQL *con, double mise, double gains){

	int i,j,bd,be,count[2],jour;

	char toopen[100];

	int combi[30];

	int nbmatchs;

	datafile data[30];

	totalButs tb;

	match liste[30];

	MYSQL_RES *result;

	MYSQL_ROW row;

	resultdata resultat[3];

	resultat[0].proba=resultat[1].proba=resultat[2].proba=resultat[0].cote=resultat[1].cote=resultat[2].cote=0;

	for(i=0;i<10;i++){

		combi[i]=0;

	}

	sprintf(toopen,"SELECT ID,DATE,ID_DOM,ID_EXT,JOURNEE FROM MATCHS WHERE A_VENIR = 1");
	mysql_query(con,toopen);
	result = mysql_store_result(con);

	i=0;

	while((row = mysql_fetch_row(result))!=NULL){

		sscanf(row[0],"%d",&liste[i].id);
		strcpy(liste[i].date,row[1]);
		sscanf(row[2],"%d",&liste[i].id_dom);
		sscanf(row[3],"%d",&liste[i].id_ext);
		sscanf(row[4],"%d",&liste[i].journee);
		data[i].proba[0]=0;
		data[i].proba[1]=0;
		data[i].proba[2]=0;
		i++;

	}

	nbmatchs = i;

	mysql_free_result(result);

	for(i=0;i<nbmatchs;i++){

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_DOM,ENC_DOM FROM EQUIPES WHERE ID = %d",liste[i].id_dom);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].dom);
		sscanf(row[1],"%d",&data[i].note[0]);
		sscanf(row[2],"%d",&data[i].mar[0]);
		sscanf(row[3],"%d",&data[i].enc[0]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_EXT,ENC_EXT FROM EQUIPES WHERE ID = %d",liste[i].id_ext);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].ext);
		sscanf(row[1],"%d",&data[i].note[1]);
		sscanf(row[2],"%d",&data[i].mar[1]);
		sscanf(row[3],"%d",&data[i].enc[1]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT DOM,NUL,EXT,DN,DE,NE FROM COTES WHERE ID_MATCH = %d",liste[i].id);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%lf",&liste[i].cdom);
		sscanf(row[1],"%lf",&liste[i].cnul);
		sscanf(row[2],"%lf",&liste[i].cext);
		sscanf(row[3],"%lf",&liste[i].cdn);
		sscanf(row[4],"%lf",&liste[i].cde);
		sscanf(row[5],"%lf",&liste[i].cne);
		mysql_free_result(result);
		data[i].gen[0] = liste[i].cdom;
		data[i].gen[1] = liste[i].cnul;
		data[i].gen[2] = liste[i].cext;
		data[i].gen[3] = liste[i].cdn;
		data[i].gen[4] = liste[i].cde;
		data[i].gen[5] = liste[i].cne;

		for(jour=0;jour<5;jour++){
			liste[i].antdom[jour] = 'e';
			liste[i].antext[jour] = 'e';
		}

		count[0] = count[1] = 0;
		jour = liste[i].journee-1;

		liste[i].bpdom = 0;
		liste[i].bcdom = 0;
		liste[i].bpext = 0;
		liste[i].bcext = 0;
		data[i].nbvic[0] = data[i].nbvic[1] = 0;
		data[i].nbnul[0] = data[i].nbnul[1] = 0;
		data[i].nbdef[0] = data[i].nbdef[1] = 0;

		while((count[0]<5 || count[1]<5) && jour>0){
			if(count[0]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_dom);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += bd;
					liste[i].bcdom += be;
						if(bd>be){
							liste[i].antdom[count[0]] = 'v';
							data[i].nbvic[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'd';
								data[i].nbdef[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_dom);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += be;
					liste[i].bcdom += bd;
						if(bd>be){
							liste[i].antdom[count[0]] = 'd';
							data[i].nbdef[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'v';
								data[i].nbvic[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}
				mysql_free_result(result);
			}

			if(count[1]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_ext);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += bd;
					liste[i].bcext += be;
						if(bd>be){
							liste[i].antext[count[1]] = 'v';
							data[i].nbvic[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'd';
								data[i].nbdef[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_ext);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += be;
					liste[i].bcext += bd;
						if(bd>be){
							liste[i].antext[count[1]] = 'd';
							data[i].nbdef[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'v';
								data[i].nbvic[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}
				mysql_free_result(result);
			}
			jour--;
		}

	}

	sprintf(toopen, "SELECT MAR_DOM, MAR_EXT FROM EQUIPES WHERE ID = 777");
	mysql_query(con,toopen);
	result = mysql_store_result(con);
	row = mysql_fetch_row(result);
	sscanf(row[0],"%d",&tb.dom);
	sscanf(row[1],"%d",&tb.ext);
	mysql_free_result(result);

	calcul_proba(nbmatchs,tb,data);

	moteur(nbmatchs,tb,mise,gains,resultat,data,combi);

	pari p[3];

	for(i=0;i<3;i++){

		p[i].gains = resultat[i].cote * mise;

		p[i].nbmatchs = 0;

		for(j=0;j<nbmatchs;j++){

			if(resultat[i].combi[j]>0){

				memcpy(&p[i].liste[p[i].nbmatchs],&liste[j],sizeof(match));

				p[i].liste[p[i].nbmatchs].res = resultat[i].combi[j];

				if(p[i].liste[p[i].nbmatchs].res == 2){
					p[i].liste[p[i].nbmatchs].res = 3;
				}else{
					if(p[i].liste[p[i].nbmatchs].res == 3) p[i].liste[p[i].nbmatchs].res = 2;
				}

				p[i].liste[p[i].nbmatchs].etoiles = proba_etoiles(resultat[i].infos[j][1],1,0,0);

				p[i].nbmatchs ++;

			}

		}

		p[i].etoiles = proba_etoiles(resultat[i].proba,0,0,0);

	}

	pariPerso_print(p);

}

void propMatch_print(pari p[3][3]){

	int k;

	for(k=0;k<3;k++){

		pariPerso_print(p[k]);
		if(k!=2) printf("$$");

	}

}

void propMatch(MYSQL *con, int journee){

	int i,j,k,mult,id_dom,id_ext,count[2],jour,bd,be;

	char toopen[100];

	MYSQL_RES *result;
	MYSQL_RES *result2;

	MYSQL_ROW row;
	MYSQL_ROW row2;

	pari p[3][3];

	for(k=0;k<3;k++){

		switch(k){

			default:
				mult=2;
				break;

			case 1:
				mult=5;
				break;

			case 2:
				mult=10;
				break;

		}

		sprintf(toopen,"SELECT ID_PARI,ETOILES,GAINS FROM PARIS WHERE JOURNEE = %d AND MULTIPLICATEUR = %d",journee,mult);
		mysql_query(con,toopen);
		result = mysql_store_result(con);

		for(i=0;i<3;i++){

			row = mysql_fetch_row(result);
			sscanf(row[0],"%d",&p[k][i].id);
			sscanf(row[1],"%d",&p[k][i].etoiles);
			sscanf(row[2],"%lf",&p[k][i].gains);
			p[k][i].mult=mult;

		}

		mysql_free_result(result);

		for(i=0;i<3;i++){

			sprintf(toopen,"SELECT ID_MATCH,RESULTAT,ETOILES FROM LISTE_MATCHS WHERE ID_PARI = %d",p[k][i].id);
			mysql_query(con,toopen);
			result = mysql_store_result(con);
			j=0;

			while((row = mysql_fetch_row(result)) != NULL){

				sscanf(row[0],"%d",&p[k][i].liste[j].id);
				sscanf(row[1],"%d",&p[k][i].liste[j].res);
				sscanf(row[2],"%d",&p[k][i].liste[j].etoiles);

				sprintf(toopen,"SELECT DATE,ID_DOM,ID_EXT FROM MATCHS WHERE ID = %d",p[k][i].liste[j].id);
				mysql_query(con,toopen);
				result2 = mysql_store_result(con);
				row2 = mysql_fetch_row(result2);
				strcpy(p[k][i].liste[j].date,row2[0]);
				sscanf(row2[1],"%d",&id_dom);
				sscanf(row2[2],"%d",&id_ext);
				mysql_free_result(result2);

				sprintf(toopen,"SELECT EQUIPE FROM EQUIPES WHERE ID = %d",id_dom);
				mysql_query(con,toopen);
				result2 = mysql_store_result(con);
				row2 = mysql_fetch_row(result2);
				sscanf(row2[0],"%s",p[k][i].liste[j].dom);
				mysql_free_result(result2);

				sprintf(toopen,"SELECT EQUIPE FROM EQUIPES WHERE ID = %d",id_ext);
				mysql_query(con,toopen);
				result2 = mysql_store_result(con);
				row2 = mysql_fetch_row(result2);
				sscanf(row2[0],"%s",p[k][i].liste[j].ext);
				mysql_free_result(result2);

				for(jour=0;jour<5;jour++){
					p[k][i].liste[j].antdom[jour] = 'e';
					p[k][i].liste[j].antext[jour] = 'e';
				}

				count[0] = count[1] = 0;
				jour = journee-1;

				p[k][i].liste[j].bpdom = 0;
				p[k][i].liste[j].bcdom = 0;
				p[k][i].liste[j].bpext = 0;
				p[k][i].liste[j].bcext = 0;

				while((count[0]<5 || count[1]<5) && jour>0){
					if(count[0]<5){
						sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,id_dom);
						mysql_query(con,toopen);
						result2 = mysql_store_result(con);
						row2 = mysql_fetch_row(result2);
						if(row2!=NULL){
							sscanf(row2[0],"%d",&bd);
							sscanf(row2[1],"%d",&be);
							if(bd!=-1 && be!=-1){
							p[k][i].liste[j].bpdom += bd;
							p[k][i].liste[j].bcdom += be;
								if(bd>be){
									p[k][i].liste[j].antdom[count[0]] = 'v';
								}else{
									if(bd<be){
										p[k][i].liste[j].antdom[count[0]] = 'd';
									}else{
										p[k][i].liste[j].antdom[count[0]] = 'n';
									}
								}
								count[0]++;
							}
						}else{
							sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,id_dom);
							mysql_query(con,toopen);
							result2 = mysql_store_result(con);
							row2 = mysql_fetch_row(result2);
							sscanf(row2[0],"%d",&bd);
							sscanf(row2[1],"%d",&be);
							if(bd!=-1 && be!=-1){
							p[k][i].liste[j].bpdom += be;
							p[k][i].liste[j].bcdom += bd;
								if(bd>be){
									p[k][i].liste[j].antdom[count[0]] = 'd';
								}else{
									if(bd<be){
										p[k][i].liste[j].antdom[count[0]] = 'v';
									}else{
										p[k][i].liste[j].antdom[count[0]] = 'n';
									}
								}
								count[0]++;
							}
						}
						mysql_free_result(result2);
					}

					if(count[1]<5){
						sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,id_ext);
						mysql_query(con,toopen);
						result2 = mysql_store_result(con);
						row2 = mysql_fetch_row(result2);
						if(row2!=NULL){
							sscanf(row2[0],"%d",&bd);
							sscanf(row2[1],"%d",&be);
							if(bd!=-1 && be!=-1){
							p[k][i].liste[j].bpext += bd;
							p[k][i].liste[j].bcext += be;
								if(bd>be){
									p[k][i].liste[j].antext[count[1]] = 'v';
								}else{
									if(bd<be){
										p[k][i].liste[j].antext[count[1]] = 'd';
									}else{
										p[k][i].liste[j].antext[count[1]] = 'n';
									}
								}
								count[1]++;
							}
						}else{
							sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,id_ext);
							mysql_query(con,toopen);
							result2 = mysql_store_result(con);
							row2 = mysql_fetch_row(result2);
							sscanf(row2[0],"%d",&bd);
							sscanf(row2[1],"%d",&be);
							if(bd!=-1 && be!=-1){
							p[k][i].liste[j].bpext += be;
							p[k][i].liste[j].bcext += bd;
								if(bd>be){
									p[k][i].liste[j].antext[count[1]] = 'd';
								}else{
									if(bd<be){
										p[k][i].liste[j].antext[count[1]] = 'v';
									}else{
										p[k][i].liste[j].antext[count[1]] = 'n';
									}
								}
								count[1]++;
							}
						}
						mysql_free_result(result2);
					}
					jour--;
				}

				j++;

			}

			p[k][i].nbmatchs = j;
			mysql_free_result(result);

		}

	}

	propMatch_print(p);

}

void propMatchV(MYSQL *con){

	propMatch(con,39);

}

void propMatchH(MYSQL *con, int journee){

	propMatch(con,journee);

}

void infoMatchV(MYSQL *con){

	int i,j,bd,be,count[2],jour;

	char toopen[100];

	double proba[3];
	int ordre[3];

	int nbmatchs;

	datafile data[30];

	totalButs tb;

	match liste[30];
	match tmp;

	MYSQL_RES *result;

	MYSQL_ROW row;

	sprintf(toopen,"SELECT ID,DATE,BUTS_DOM,BUTS_EXT,ID_DOM,ID_EXT,JOURNEE FROM MATCHS WHERE A_VENIR = 1");
	mysql_query(con,toopen);
	result = mysql_store_result(con);

	i=0;

	while((row = mysql_fetch_row(result))!=NULL){

		sscanf(row[0],"%d",&liste[i].id);
		strcpy(liste[i].date,row[1]);
		sscanf(row[2],"%d",&liste[i].bd);
		sscanf(row[3],"%d",&liste[i].be);
		sscanf(row[4],"%d",&liste[i].id_dom);
		sscanf(row[5],"%d",&liste[i].id_ext);
		sscanf(row[6],"%d",&liste[i].journee);
		data[i].proba[0]=0;
		data[i].proba[1]=0;
		data[i].proba[2]=0;
		i++;

	}

	nbmatchs = i;

	mysql_free_result(result);

	for(i=0;i<nbmatchs;i++){

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_DOM,ENC_DOM FROM EQUIPES WHERE ID = %d",liste[i].id_dom);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].dom);
		sscanf(row[1],"%d",&data[i].note[0]);
		sscanf(row[2],"%d",&data[i].mar[0]);
		sscanf(row[3],"%d",&data[i].enc[0]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_EXT,ENC_EXT FROM EQUIPES WHERE ID = %d",liste[i].id_ext);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].ext);
		sscanf(row[1],"%d",&data[i].note[1]);
		sscanf(row[2],"%d",&data[i].mar[1]);
		sscanf(row[3],"%d",&data[i].enc[1]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT DOM,NUL,EXT,DN,DE,NE FROM COTES WHERE ID_MATCH = %d",liste[i].id);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%lf",&liste[i].cdom);
		sscanf(row[1],"%lf",&liste[i].cnul);
		sscanf(row[2],"%lf",&liste[i].cext);
		sscanf(row[3],"%lf",&liste[i].cdn);
		sscanf(row[4],"%lf",&liste[i].cde);
		sscanf(row[5],"%lf",&liste[i].cne);
		mysql_free_result(result);
		data[i].gen[0] = liste[i].cdom;
		data[i].gen[1] = liste[i].cnul;
		data[i].gen[2] = liste[i].cext;
		data[i].gen[3] = liste[i].cdn;
		data[i].gen[4] = liste[i].cde;
		data[i].gen[5] = liste[i].cne;

		for(jour=0;jour<5;jour++){
			liste[i].antdom[jour] = 'e';
			liste[i].antext[jour] = 'e';
		}

		count[0] = count[1] = 0;
		jour = liste[i].journee-1;

		liste[i].bpdom = 0;
		liste[i].bcdom = 0;
		liste[i].bpext = 0;
		liste[i].bcext = 0;
		data[i].nbvic[0] = data[i].nbvic[1] = 0;
		data[i].nbnul[0] = data[i].nbnul[1] = 0;
		data[i].nbdef[0] = data[i].nbdef[1] = 0;

		while((count[0]<5 || count[1]<5) && jour>0){
			if(count[0]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_dom);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += bd;
					liste[i].bcdom += be;
						if(bd>be){
							liste[i].antdom[count[0]] = 'v';
							data[i].nbvic[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'd';
								data[i].nbdef[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_dom);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += be;
					liste[i].bcdom += bd;
						if(bd>be){
							liste[i].antdom[count[0]] = 'd';
							data[i].nbdef[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'v';
								data[i].nbvic[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}
				mysql_free_result(result);
			}

			if(count[1]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_ext);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += bd;
					liste[i].bcext += be;
						if(bd>be){
							liste[i].antext[count[1]] = 'v';
							data[i].nbvic[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'd';
								data[i].nbdef[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_ext);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += be;
					liste[i].bcext += bd;
						if(bd>be){
							liste[i].antext[count[1]] = 'd';
							data[i].nbdef[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'v';
								data[i].nbvic[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}
				mysql_free_result(result);
			}
			jour--;
		}

	}



	sprintf(toopen, "SELECT MAR_DOM, MAR_EXT FROM EQUIPES WHERE ID = 777");
	mysql_query(con,toopen);
	result = mysql_store_result(con);
	row = mysql_fetch_row(result);
	sscanf(row[0],"%d",&tb.dom);
	sscanf(row[1],"%d",&tb.ext);
	mysql_free_result(result);

	calcul_proba(nbmatchs,tb,data);

	for(i=0;i<nbmatchs;i++){

		for(j=1;j<4;j++){

			proba[j-1]=data[i].proba[j-1];

		}

		ordre[0]=0;
		ordre[1]=1;
		ordre[2]=2;

		if(proba[0]<proba[1]){

			if(proba[1]<proba[2]){

				ordre[0]=2;
				ordre[1]=1;
				ordre[2]=0;

			}else{

				if(proba[0]<proba[2]){

					ordre[0]=1;
					ordre[1]=2;
					ordre[2]=0;

				}else{

					ordre[0]=1;
					ordre[1]=0;
					ordre[2]=2;

				}

			}

		}else{

			if(proba[0]<proba[2]){

				ordre[0]=2;
				ordre[1]=0;
				ordre[2]=1;

			}else{

				if(proba[1]<proba[2]){

					ordre[0]=0;
					ordre[1]=2;
					ordre[2]=1;

				}else{

					ordre[0]=0;
					ordre[1]=1;
					ordre[2]=2;

				}

			}

		}

		if((proba[ordre[0]] > PROBA_MIN || proba[ordre[0]]-proba[ordre[1]]>ECART_PROBA_MIN) || proba[ordre[0]] * (data[i].gen[ordre[0]]-1) - (1-proba[ordre[0]]) > (proba[ordre[0]]+proba[ordre[1]]) * (data[i].gen[ordre[0]+ordre[1]+2]-1) - (1-proba[ordre[0]]-proba[ordre[1]])){

			switch(ordre[0]){

				case 0:
					liste[i].res = 1;
					break;
				case 1:
					liste[i].res = 3;
					break;
				case 2:
					liste[i].res = 2;
					break;

			}

		}else{

			liste[i].res = ordre[0]+ordre[1]+3;

		}

		liste[i].edom = proba_etoiles(proba[0],proba[1],proba[2],1);
		liste[i].eext = proba_etoiles(proba[0],proba[1],proba[2],2);
		liste[i].enul = proba_etoiles(proba[0],proba[1],proba[2],3);
		liste[i].edn = proba_etoiles(proba[0],proba[1],proba[2],4);
		liste[i].ede = proba_etoiles(proba[0],proba[1],proba[2],5);
		liste[i].ene = proba_etoiles(proba[0],proba[1],proba[2],6);

	}

	do{

		j=1;

		for(i=0;i<nbmatchs-1;i++){

			if(liste[i].journee>liste[i+1].journee){

				j=0;
				memcpy(&tmp,&liste[i],sizeof(match));
				memcpy(&liste[i],&liste[i+1],sizeof(match));
				memcpy(&liste[i+1],&tmp,sizeof(match));

			}

		}

	}while(j==0);

	do{

		j=1;

		for(i=0;i<nbmatchs-1;i++){

			if(liste[i].journee==liste[i+1].journee){

				if(compare_date(liste[i].date,liste[i+1].date)>0){

					j=0;
					memcpy(&tmp,&liste[i],sizeof(match));
					memcpy(&liste[i],&liste[i+1],sizeof(match));
					memcpy(&liste[i+1],&tmp,sizeof(match));

				}

			}else{

				if(liste[i].journee>liste[i+1].journee){

					j=0;
					memcpy(&tmp,&liste[i],sizeof(match));
					memcpy(&liste[i],&liste[i+1],sizeof(match));
					memcpy(&liste[i+1],&tmp,sizeof(match));

				}

			}

		}

	}while(j==0);

	printf("%d!!",nombre_journees(nbmatchs,liste));

	jour = -1;

	for(i=0;i<nbmatchs;i++){

		if(jour<0){

			printf("%d--%d--",liste[i].journee,nombre_matchs_journee(nbmatchs,liste,liste[i].journee));
			jour = liste[i].journee;

		}else{

			if(liste[i].journee!=jour){

				printf("++%d--%d--",liste[i].journee,nombre_matchs_journee(nbmatchs,liste,liste[i].journee));
				jour=liste[i].journee;

			}

		}

		printf("%s;;%s;;%s;;%d;;%d;;%lf;;%lf;;%lf;;%lf;;%lf;;%lf;;%d;;%d;;%d;;%d;;%d;;%d;;%d;;%c%c%c%c%c;;%c%c%c%c%c;;%d;;%d;;%d;;%d",liste[i].date,liste[i].dom,liste[i].ext,liste[i].bd,liste[i].be,liste[i].cdom,liste[i].cext,liste[i].cnul,liste[i].cdn,liste[i].cde,liste[i].cne,liste[i].res,liste[i].edom,liste[i].eext,liste[i].enul,liste[i].edn,liste[i].ede,liste[i].ene,liste[i].antdom[0],liste[i].antdom[1],liste[i].antdom[2],liste[i].antdom[3],liste[i].antdom[4],liste[i].antext[0],liste[i].antext[1],liste[i].antext[2],liste[i].antext[3],liste[i].antext[4],liste[i].bpdom,liste[i].bcdom,liste[i].bpext,liste[i].bcext);

		if(i!=nbmatchs-1) printf("::");

	}


}

void infoMatchH(MYSQL *con,int journee){

	int i,j,bd,be,count[2],jour;

	char toopen[100];

	double proba[3];
	int ordre[3];

	datafile data[10];

	totalButs tb;

	match liste[10];
	match tmp;

	MYSQL_RES *result;

	MYSQL_ROW row;

	sprintf(toopen,"SELECT ID,DATE,BUTS_DOM,BUTS_EXT,ID_DOM,ID_EXT FROM MATCHS WHERE JOURNEE = %d",journee);
	mysql_query(con,toopen);
	result = mysql_store_result(con);

	for(i=0;i<10;i++){

		row = mysql_fetch_row(result);

		sscanf(row[0],"%d",&liste[i].id);
		strcpy(liste[i].date,row[1]);
		sscanf(row[2],"%d",&liste[i].bd);
		sscanf(row[3],"%d",&liste[i].be);
		sscanf(row[4],"%d",&liste[i].id_dom);
		sscanf(row[5],"%d",&liste[i].id_ext);
		data[i].proba[0]=0;
		data[i].proba[1]=0;
		data[i].proba[2]=0;

	}

	mysql_free_result(result);

	for(i=0;i<10;i++){

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_DOM,ENC_DOM FROM EQUIPES WHERE ID = %d",liste[i].id_dom);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].dom);
		sscanf(row[1],"%d",&data[i].note[0]);
		sscanf(row[2],"%d",&data[i].mar[0]);
		sscanf(row[3],"%d",&data[i].enc[0]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_EXT,ENC_EXT FROM EQUIPES WHERE ID = %d",liste[i].id_ext);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].ext);
		sscanf(row[1],"%d",&data[i].note[1]);
		sscanf(row[2],"%d",&data[i].mar[1]);
		sscanf(row[3],"%d",&data[i].enc[1]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT DOM,NUL,EXT,DN,DE,NE FROM COTES WHERE ID_MATCH = %d",liste[i].id);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%lf",&liste[i].cdom);
		sscanf(row[1],"%lf",&liste[i].cnul);
		sscanf(row[2],"%lf",&liste[i].cext);
		sscanf(row[3],"%lf",&liste[i].cdn);
		sscanf(row[4],"%lf",&liste[i].cde);
		sscanf(row[5],"%lf",&liste[i].cne);
		mysql_free_result(result);
		data[i].gen[0] = liste[i].cdom;
		data[i].gen[1] = liste[i].cnul;
		data[i].gen[2] = liste[i].cext;
		data[i].gen[3] = liste[i].cdn;
		data[i].gen[4] = liste[i].cde;
		data[i].gen[5] = liste[i].cne;

		for(jour=0;jour<5;jour++){
			liste[i].antdom[jour] = 'e';
			liste[i].antext[jour] = 'e';
		}

		count[0] = count[1] = 0;
		jour = journee-1;

		liste[i].bpdom = 0;
		liste[i].bcdom = 0;
		liste[i].bpext = 0;
		liste[i].bcext = 0;
		data[i].nbvic[0] = data[i].nbvic[1] = 0;
		data[i].nbnul[0] = data[i].nbnul[1] = 0;
		data[i].nbdef[0] = data[i].nbdef[1] = 0;

		while((count[0]<5 || count[1]<5) && jour>0){
			if(count[0]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_dom);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += bd;
					liste[i].bcdom += be;
						if(bd>be){
							liste[i].antdom[count[0]] = 'v';
							data[i].nbvic[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'd';
								data[i].nbdef[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_dom);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += be;
					liste[i].bcdom += bd;
						if(bd>be){
							liste[i].antdom[count[0]] = 'd';
							data[i].nbdef[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'v';
								data[i].nbvic[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}
				mysql_free_result(result);
			}

			if(count[1]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_ext);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += bd;
					liste[i].bcext += be;
						if(bd>be){
							liste[i].antext[count[1]] = 'v';
							data[i].nbvic[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'd';
								data[i].nbdef[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_ext);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += be;
					liste[i].bcext += bd;
						if(bd>be){
							liste[i].antext[count[1]] = 'd';
							data[i].nbdef[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'v';
								data[i].nbvic[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}
				mysql_free_result(result);
			}
			jour--;
		}

	}



	sprintf(toopen, "SELECT MAR_DOM, MAR_EXT FROM EQUIPES WHERE ID = 777");
	mysql_query(con,toopen);
	result = mysql_store_result(con);
	row = mysql_fetch_row(result);
	sscanf(row[0],"%d",&tb.dom);
	sscanf(row[1],"%d",&tb.ext);
	mysql_free_result(result);

	calcul_proba(10,tb,data);

	for(i=0;i<10;i++){

		for(j=1;j<4;j++){

			proba[j-1]=data[i].proba[j-1];

		}

		ordre[0]=0;
		ordre[1]=1;
		ordre[2]=2;

		if(proba[0]<proba[1]){

			if(proba[1]<proba[2]){

				ordre[0]=2;
				ordre[1]=1;
				ordre[2]=0;

			}else{

				if(proba[0]<proba[2]){

					ordre[0]=1;
					ordre[1]=2;
					ordre[2]=0;

				}else{

					ordre[0]=1;
					ordre[1]=0;
					ordre[2]=2;

				}

			}

		}else{

			if(proba[0]<proba[2]){

				ordre[0]=2;
				ordre[1]=0;
				ordre[2]=1;

			}else{

				if(proba[1]<proba[2]){

					ordre[0]=0;
					ordre[1]=2;
					ordre[2]=1;

				}else{

					ordre[0]=0;
					ordre[1]=1;
					ordre[2]=2;

				}

			}

		}

		if((proba[ordre[0]] > PROBA_MIN || proba[ordre[0]]-proba[ordre[1]]>ECART_PROBA_MIN) || proba[ordre[0]] * (data[i].gen[ordre[0]]-1) - (1-proba[ordre[0]]) > (proba[ordre[0]]+proba[ordre[1]]) * (data[i].gen[ordre[0]+ordre[1]+2]-1) - (1-proba[ordre[0]]-proba[ordre[1]])){

			switch(ordre[0]){

				case 0:
					liste[i].res = 1;
					break;
				case 1:
					liste[i].res = 3;
					break;
				case 2:
					liste[i].res = 2;
					break;

			}

		}else{

			liste[i].res = ordre[0]+ordre[1]+3;

		}

		liste[i].edom = proba_etoiles(proba[0],proba[1],proba[2],1);
		liste[i].eext = proba_etoiles(proba[0],proba[1],proba[2],2);
		liste[i].enul = proba_etoiles(proba[0],proba[1],proba[2],3);
		liste[i].edn = proba_etoiles(proba[0],proba[1],proba[2],4);
		liste[i].ede = proba_etoiles(proba[0],proba[1],proba[2],5);
		liste[i].ene = proba_etoiles(proba[0],proba[1],proba[2],6);

	}

	do{

		j=1;

		for(i=0;i<9-1;i++){

			if(compare_date(liste[i].date,liste[i+1].date)>0){

				j=0;
				memcpy(&tmp,&liste[i],sizeof(match));
				memcpy(&liste[i],&liste[i+1],sizeof(match));
				memcpy(&liste[i+1],&tmp,sizeof(match));

			}

		}

	}while(j==0);

	printf("1!!%d--10--",journee);

	for(i=0;i<10;i++){

		printf("%s;;%s;;%s;;%d;;%d;;%lf;;%lf;;%lf;;%lf;;%lf;;%lf;;%d;;%d;;%d;;%d;;%d;;%d;;%d;;%c%c%c%c%c;;%c%c%c%c%c;;%d;;%d;;%d;;%d",liste[i].date,liste[i].dom,liste[i].ext,liste[i].bd,liste[i].be,liste[i].cdom,liste[i].cext,liste[i].cnul,liste[i].cdn,liste[i].cde,liste[i].cne,liste[i].res,liste[i].edom,liste[i].eext,liste[i].enul,liste[i].edn,liste[i].ede,liste[i].ene,liste[i].antdom[0],liste[i].antdom[1],liste[i].antdom[2],liste[i].antdom[3],liste[i].antdom[4],liste[i].antext[0],liste[i].antext[1],liste[i].antext[2],liste[i].antext[3],liste[i].antext[4],liste[i].bpdom,liste[i].bcdom,liste[i].bpext,liste[i].bcext);

		if(i!=9) printf("::");

	}

}

void getProp(MYSQL *con, double mise, double gains, pari p[3],int journee){

	int i,j,bd,be,count[2],jour;

	char toopen[100];

	int combi[30];

	int nbmatchs;

	datafile data[30];

	totalButs tb;

	match liste[30];

	MYSQL_RES *result;

	MYSQL_ROW row;

	resultdata resultat[3];

	resultat[0].proba=resultat[1].proba=resultat[2].proba=resultat[0].cote=resultat[1].cote=resultat[2].cote=0;

	for(i=0;i<10;i++){

		combi[i]=0;

	}
	if(journee<39){

		sprintf(toopen,"SELECT ID,DATE,ID_DOM,ID_EXT FROM MATCHS WHERE JOURNEE = %d",journee);
		mysql_query(con,toopen);
		result = mysql_store_result(con);

		i=0;

		while((row = mysql_fetch_row(result))!=NULL){

			sscanf(row[0],"%d",&liste[i].id);
			strcpy(liste[i].date,row[1]);
			sscanf(row[2],"%d",&liste[i].id_dom);
			sscanf(row[3],"%d",&liste[i].id_ext);
			liste[i].journee = journee;
			data[i].proba[0]=0;
			data[i].proba[1]=0;
			data[i].proba[2]=0;
			i++;

		}

	}else{

		sprintf(toopen,"SELECT ID,DATE,ID_DOM,ID_EXT,JOURNEE FROM MATCHS WHERE A_VENIR = 1");
		mysql_query(con,toopen);
		result = mysql_store_result(con);

		i=0;

		while((row = mysql_fetch_row(result))!=NULL){

			sscanf(row[0],"%d",&liste[i].id);
			strcpy(liste[i].date,row[1]);
			sscanf(row[2],"%d",&liste[i].id_dom);
			sscanf(row[3],"%d",&liste[i].id_ext);
			sscanf(row[4],"%d",&liste[i].journee);
			i++;

		}

	}

	nbmatchs = i;

	mysql_free_result(result);

	for(i=0;i<nbmatchs;i++){

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_DOM,ENC_DOM FROM EQUIPES WHERE ID = %d",liste[i].id_dom);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].dom);
		sscanf(row[1],"%d",&data[i].note[0]);
		sscanf(row[2],"%d",&data[i].mar[0]);
		sscanf(row[3],"%d",&data[i].enc[0]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT EQUIPE,NOTE,MAR_EXT,ENC_EXT FROM EQUIPES WHERE ID = %d",liste[i].id_ext);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%s",liste[i].ext);
		sscanf(row[1],"%d",&data[i].note[1]);
		sscanf(row[2],"%d",&data[i].mar[1]);
		sscanf(row[3],"%d",&data[i].enc[1]);
		mysql_free_result(result);

		sprintf(toopen,"SELECT DOM,NUL,EXT,DN,DE,NE FROM COTES WHERE ID_MATCH = %d",liste[i].id);
		mysql_query(con,toopen);
		result = mysql_store_result(con);
		row = mysql_fetch_row(result);
		sscanf(row[0],"%lf",&liste[i].cdom);
		sscanf(row[1],"%lf",&liste[i].cnul);
		sscanf(row[2],"%lf",&liste[i].cext);
		sscanf(row[3],"%lf",&liste[i].cdn);
		sscanf(row[4],"%lf",&liste[i].cde);
		sscanf(row[5],"%lf",&liste[i].cne);
		mysql_free_result(result);
		data[i].gen[0] = liste[i].cdom;
		data[i].gen[1] = liste[i].cnul;
		data[i].gen[2] = liste[i].cext;
		data[i].gen[3] = liste[i].cdn;
		data[i].gen[4] = liste[i].cde;
		data[i].gen[5] = liste[i].cne;

		for(jour=0;jour<5;jour++){
			liste[i].antdom[jour] = 'e';
			liste[i].antext[jour] = 'e';
		}

		count[0] = count[1] = 0;
		jour = journee-1;

		liste[i].bpdom = 0;
		liste[i].bcdom = 0;
		liste[i].bpext = 0;
		liste[i].bcext = 0;
		data[i].nbvic[0] = data[i].nbvic[1] = 0;
		data[i].nbnul[0] = data[i].nbnul[1] = 0;
		data[i].nbdef[0] = data[i].nbdef[1] = 0;

		while((count[0]<5 || count[1]<5) && jour>0){
			if(count[0]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_dom);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += bd;
					liste[i].bcdom += be;
						if(bd>be){
							liste[i].antdom[count[0]] = 'v';
							data[i].nbvic[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'd';
								data[i].nbdef[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_dom);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpdom += be;
					liste[i].bcdom += bd;
						if(bd>be){
							liste[i].antdom[count[0]] = 'd';
							data[i].nbdef[0] ++;
						}else{
							if(bd<be){
								liste[i].antdom[count[0]] = 'v';
								data[i].nbvic[0] ++;
							}else{
								liste[i].antdom[count[0]] = 'n';
								data[i].nbnul[0] ++;
							}
						}
						count[0]++;
					}
				}
				mysql_free_result(result);
			}

			if(count[1]<5){
				sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_DOM = %d",jour,liste[i].id_ext);
				mysql_query(con,toopen);
				result = mysql_store_result(con);
				row = mysql_fetch_row(result);
				if(row!=NULL){
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += bd;
					liste[i].bcext += be;
						if(bd>be){
							liste[i].antext[count[1]] = 'v';
							data[i].nbvic[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'd';
								data[i].nbdef[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}else{
					sprintf(toopen,"SELECT BUTS_DOM,BUTS_EXT FROM MATCHS WHERE JOURNEE = %d AND ID_EXT = %d",jour,liste[i].id_ext);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					sscanf(row[0],"%d",&bd);
					sscanf(row[1],"%d",&be);
					if(bd!=-1 && be!=-1){
					liste[i].bpext += be;
					liste[i].bcext += bd;
						if(bd>be){
							liste[i].antext[count[1]] = 'd';
							data[i].nbdef[1] ++;
						}else{
							if(bd<be){
								liste[i].antext[count[1]] = 'v';
								data[i].nbvic[1] ++;
							}else{
								liste[i].antext[count[1]] = 'n';
								data[i].nbnul[1] ++;
							}
						}
						count[1]++;
					}
				}
				mysql_free_result(result);
			}
			jour--;
		}

	}

	sprintf(toopen, "SELECT MAR_DOM, MAR_EXT FROM EQUIPES WHERE ID = 777");
	mysql_query(con,toopen);
	result = mysql_store_result(con);
	row = mysql_fetch_row(result);
	sscanf(row[0],"%d",&tb.dom);
	sscanf(row[1],"%d",&tb.ext);
	mysql_free_result(result);

	calcul_proba(nbmatchs,tb,data);

	moteur(nbmatchs,tb,mise,gains,resultat,data,combi);

	for(i=0;i<3;i++){

		p[i].gains = resultat[i].cote * mise;

		p[i].nbmatchs = 0;

		for(j=0;j<nbmatchs;j++){

			if(resultat[i].combi[j]>0){

				memcpy(&p[i].liste[p[i].nbmatchs],&liste[j],sizeof(match));

				p[i].liste[p[i].nbmatchs].res = resultat[i].combi[j];

				if(p[i].liste[p[i].nbmatchs].res == 2){
					p[i].liste[p[i].nbmatchs].res = 3;
				}else{
					if(p[i].liste[p[i].nbmatchs].res == 3) p[i].liste[p[i].nbmatchs].res = 2;
				}

				p[i].liste[p[i].nbmatchs].etoiles = proba_etoiles(resultat[i].infos[j][1],1,0,0);

				p[i].nbmatchs ++;

			}

		}

		p[i].etoiles = proba_etoiles(resultat[i].proba,0,0,0);

	}

}

int verif_update_pari(MYSQL *con, int journee){
//return 1;
	MYSQL_RES *result;

	MYSQL_ROW row;

	char toopen[100];

	if(journee>=39) return 1;

	sprintf(toopen, "SELECT ID FROM MATCHS WHERE JOURNEE = %d AND A_VENIR = 1",journee);
	mysql_query(con,toopen);
	result = mysql_store_result(con);
	row = mysql_fetch_row(result);
	if(row!=NULL){
		mysql_free_result(result);
		return 1;
	}
	return 0;

}

void setParis(MYSQL *con){

	pari p[3];

	double mult;

	int i,j,k,l,id;

	char toopen[100];

	MYSQL_RES *result;

	MYSQL_ROW row;

	for(i=1;i<=39;i++){
		if(verif_update_pari(con,i) == 1){
			for(j=0;j<3;j++){
				switch(j){
					case 0:
						mult=2;
						break;
					case 1:
						mult=5;
						break;
					case 2:
						mult=10;
						break;
				}
				getProp(con,1,mult,p,i);

				for(l=0;l<3;l++){
					sprintf(toopen, "SELECT ID_PARI FROM PARIS WHERE JOURNEE = %d AND MULTIPLICATEUR = %d AND ORDRE = %d",i,(int)(mult),l);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					if(row==NULL){
						sprintf(toopen, "INSERT INTO PARIS (JOURNEE,MULTIPLICATEUR,ORDRE,ETOILES,GAINS) VALUES (%d,%d,%d,%d,%lf)",i,(int)(mult),l,p[l].etoiles,p[l].gains);
						mysql_query(con,toopen);
						sprintf(toopen, "SELECT ID_PARI FROM PARIS WHERE JOURNEE = %d AND MULTIPLICATEUR = %d AND ORDRE = %d",i,(int)(mult),l);
						mysql_query(con,toopen);
						result = mysql_store_result(con);
						row = mysql_fetch_row(result);
						sscanf(row[0],"%d",&id);
						mysql_free_result(result);
					}else{
						sscanf(row[0],"%d",&id);
						mysql_free_result(result);
						sprintf(toopen, "UPDATE PARIS SET ETOILES = %d, GAINS = %lf WHERE ID_PARI = %d",p[l].etoiles,p[l].gains,id);
						mysql_query(con,toopen);
					}


					sprintf(toopen, "SELECT ID_LISTE FROM LISTE_MATCHS WHERE ID_PARI = %d",id);
					mysql_query(con,toopen);
					result = mysql_store_result(con);
					row = mysql_fetch_row(result);
					mysql_free_result(result);
					if(row!=NULL){

						sprintf(toopen, "DELETE FROM LISTE_MATCHS WHERE ID_PARI = %d",id);
						mysql_query(con,toopen);

					}
					for(k=0;k<p[l].nbmatchs;k++){

						sprintf(toopen, "INSERT INTO LISTE_MATCHS (ID_PARI,ID_MATCH,RESULTAT,ETOILES) VALUES (%d,%d,%d,%d)",id,p[l].liste[k].id,p[l].liste[k].res,p[l].liste[k].etoiles);
						mysql_query(con,toopen);
					}

				}

			}

		}

	}

}

void quit(MYSQL *con){

	mysql_close(con);
	exit(0);

}

int main(int argc,char *argv[]){
globale=0;
	int param1;

	double param2,param3;

	MYSQL *con = mysql_init(NULL);

	mysql_real_connect(con, "jmyx101", "frc", "esiea000!", "FRC_2018", 0, NULL, 0);

	if(argc>1){

		if(strcmp(argv[1],"test")==0){

			printf("ok\n");
			quit(con);

		}

		if(strcmp(argv[1],"propMatchV")==0){

			propMatchV(con);
			quit(con);

		}

		if(strcmp(argv[1],"propMatchH")==0){

			sscanf(argv[2],"%d",&param1);
			propMatchH(con,param1);
			quit(con);

		}

		if(strcmp(argv[1],"pariPerso")==0){

			sscanf(argv[2],"%lf",&param2);
			sscanf(argv[3],"%lf",&param3);
			pariPerso(con,param2,param3);
			quit(con);

		}

		if(strcmp(argv[1],"infoMatchV")==0){

			infoMatchV(con);
			quit(con);

		}

		if(strcmp(argv[1],"infoMatchH")==0){

			sscanf(argv[2],"%d",&param1);
			infoMatchH(con,param1);
			quit(con);

		}

		if(strcmp(argv[1],"classementV")==0){

			classementV(con);
			quit(con);

		}

		if(strcmp(argv[1],"classementH")==0){

			sscanf(argv[2],"%d",&param1);
			classementH(con,param1);
			quit(con);

		}

		if(strcmp(argv[1],"setParis")==0){

			setParis(con);
			quit(con);

		}

	}

	quit(con);

	return 0;

}
