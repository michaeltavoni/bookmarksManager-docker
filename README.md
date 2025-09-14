# Bookmarks Manager - Docker

## Descrizione

Bookmarks Manager è una piccola web app pensata per organizzare e ricercare facilmente i propri segnalibri.
Il progetto nasce da un’esigenza personale: come analista funzionale, ho spesso la necessità di avere un unico punto di accesso ai vari applicativi che seguo, con i loro ambienti e clienti associati.

Grazie a questa applicazione è sufficiente aggiornare un semplice file di configurazione locale, caricarlo e ritrovarsi immediatamente tutti i link utili, ordinati e pronti all’uso.

---

## Struttura del progetto

Ecco la struttura dei file/cartelle principali:

```
bookmarksManager-docker/
├── app/                # codice dell'applicazione
├── app-config/         # file di configurazione dell’app
├── nginx/              # configurazione del server Nginx
├── Dockerfile          # definizione dell’immagine dell’app
├── docker-compose.yml  # orchestrazione dei container
├── requirements.txt    # dipendenze Python
├── .dockerignore
└── .gitignore
```

---

## Prerequisiti

* Docker
* Docker Compose
* Un sistema operativo compatibile con Docker

---

## Installazione / Setup

1. Clona il repository:

   ```bash
   git clone https://github.com/michaeltavoni/bookmarksManager-docker.git
   cd bookmarksManager-docker
   ```

2. Personalizza le impostazioni (se necessario):

   * Controlla la cartella `app-config/` per configurare i bookmarks e le db connection.
   * Se necessario, modifica i file di configurazione di Nginx nella cartella `nginx/`.

3. Costruisci ed avvia i container:

   ```bash
   docker-compose up --build
   ```

4. Visita l’app via browser sull’host e porta configurati.

---

## Uso

* L’app permette di aggiungere, modificare, rimuovere segnalibri.
* È possibile organizzare le connessinoni a db relativi alle webapp salvate.
* È disponibile un’interfaccia web frontend + backend per la gestione.
* È previsto un server Nginx che funge da reverse proxy o da server statico per il frontend.

---

## Variabili di configurazione

Qui alcune impostazioni che potrebbero servirti:

| Variabile / File     | Descrizione                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `app-config/`        | Dove sono contenute le configurazioni dell’app                                                    |
| `nginx/`             | File di configurazione Nginx: host, porte, routing, certificati se necessario                     |
| `docker-compose.yml` | Porte esposte, dipendenze tra i container, volumi persistenti                                     |

---

## Comandi utili

* `docker-compose up --build` — costruisci e avvia i container
* `docker-compose down` — ferma tutto
* `docker-compose logs` — vedi i log
* `docker-compose restart` — riavvia i servizi

---

## Ambiente di sviluppo

Per lo sviluppo locale puoi:

* modificare il codice in `app/`, poi ricostruire il container
* utilizzare volumi Docker per fare il mount del codice locale nel container
* utilizzare strumenti come `nodemon`, `flask reload`, o equivalenti per il backend per far ricaricare automaticamente le modifiche

---

## Sicurezza & Best Practices

* Non includere credenziali sensibili nel repository: usa variabili d’ambiente o file di configurazione ignorati da git.
* Assicurati che Nginx sia configurato correttamente per HTTPS se esponi l’app su internet.
* Usa versioni aggiornate delle dipendenze.

