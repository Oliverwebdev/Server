import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import open from 'open';
import helmet from 'helmet'; // Paket für Sicherheits-HTTP-Header

const app = express();

// Middleware für das Parsen von JSON-Anfragen
app.use(bodyParser.json());

// Middleware für Sicherheits-HTTP-Header
app.use(helmet());

// Middleware für das Logging von Anfragen
app.use((req, res, next) => {
  const logData = `${new Date().toLocaleString()} - IP: ${req.ip}, Method: ${req.method}, Path: ${req.originalUrl}\n`;
  fs.appendFile('request_logs.txt', logData, (err) => {
    if (err) {
      console.error('Error writing to request_logs.txt:', err);
    }
  });
  next();
});

// Beispiel-Routen

// Startseite
app.get('/', (req, res) => {
  res.send('Welcome to the server application!');
});

// Eine Fehlerbehandlungsmiddleware für nicht gefundene Routen
app.use((req, res, next) => {
  res.status(404).send('Sorry, can\'t find that!');
});

// Fehlerbehandlungsmiddleware für andere Fehler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server starten
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Öffne den Browser mit der Server-URL
  open(`http://localhost:${PORT}`);
});
