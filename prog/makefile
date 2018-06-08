all: RecupInfos Moteur

RecupInfos: RecupBetClic.java RecupSoccerStats.java RecupBetclicResultatDouble.java
	javac -cp ".:./mysql.jar" *.java

start_SoccerStats: RecupInfos
	java -cp ".:./mysql.jar" RecupSoccerStats

start_BetClic: RecupInfos
	java -cp ".:./mysql.jar" RecupBetClic

start_BetClicResultatDouble: RecupInfos
	java -cp ".:./mysql.jar" RecupBetclicResultatDouble

start_BetClicGoals: RecupInfos
	java -cp ".:./mysql.jar" RecupBetclicGoals

Moteur: moteur.c
	gcc -Wall moteur.c -o moteur -lm -lmysqlclient

start_Moteur: Moteur
	./moteur "setParis"

clean:
	rm -rf *.o
	rm -rf *.class

mrproper: clean
	rm -rf moteur

