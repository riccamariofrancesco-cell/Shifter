# Shifter

App Android (Kotlin) minimale per impostare una posizione GPS fittizia usando le API ufficiali
di `LocationManager` (test provider) e la funzione "Seleziona app per posizioni fittizie"
delle Opzioni sviluppatore.

## Come aprirla
Apri la cartella in **Android Studio** (Ladybug o successivo, JDK 17+) e fai *Sync*: il wrapper
Gradle è già incluso. Poi **Run ▶** su un dispositivo/emulatore (minSdk 26).

## Come usarla
1. Attiva le **Opzioni sviluppatore** (Impostazioni → Info telefono → tocca 7 volte *Numero build*).
2. Opzioni sviluppatore → **Seleziona app per posizioni fittizie** → scegli *Shifter*.
3. Apri Shifter, inserisci latitudine e longitudine, premi **Avvia posizione fittizia**
   (concedi il permesso di posizione/notifiche).
4. Premi **Ferma** per tornare alla posizione reale.

## Stato mostrato
- **ATTIVA**: la posizione fittizia viene inviata (ogni secondo, tramite un servizio in primo piano).
- **DISATTIVATA**: l'app è pronta ma nessuna posizione fittizia è in corso.
- **ERRORE**: es. l'app non è selezionata nelle Opzioni sviluppatore, o le Opzioni sviluppatore
  non sono attive. Il messaggio spiega cosa fare e c'è un pulsante per aprire le impostazioni.

## Versione e download
Versione corrente: **1.0.0**. L'APK pronto da installare è nella pagina
[Releases](../../releases) del repository.

## Licenza
Distribuita con licenza **GNU General Public License v3.0** (vedi il file [LICENSE](LICENSE)).
