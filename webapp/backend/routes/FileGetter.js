const express = require("express");
const router = express.Router();
const fs = require("fs")
const path = require('path');


router.get("/files/:filename",
    (req, res) =>{

        const filename = req.params.filename

        // Controlla se il file esiste
        fs.access("uploads/" + filename, fs.constants.F_OK, (err) => {
            if (err) {
                res.status(404).send('File non trovato');
                return;
            }

            // Legge il file
            fs.readFile("uploads/" + filename, (err, data) => {
                if (err) {
                    res.status(500).send('Errore interno del server');
                    return;
                }

                // Invia il file come risposta
                res.set('Content-Type', 'text/plain');
                res.send(data);
            })
        })
    })

module.exports = router