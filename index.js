/* Importação de dependencias */
const express = require('express');
const crypto = require('crypto');
const cors = require("cors");
const bodyParser = require("body-parser");
const exec = require('child_process').exe;
const http = require('http');

/* Segredo utilizado pelo webhook para assinar chamada */
const segredo = process.env.PIPELINE_SEGREDO;

/* Local do projeto a ser feito o pipeline */
const repositorio = "~/iforgot";

/* Inicialização da aplicação */
const app = express();

/* Utilizando apenas de segurança. */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/pipelines/iforgot', function (req, res) {

    const assinatura = "sha1=" + crypto.createHmac('sha1', segredo).update(JSON.stringify(req.body)).digest('hex');
    console.log(req.headers);
    console.log(assinatura);
    if (req.headers['x-hub-signature'] == assinatura) {
        exec('cd ' + repositorio + ' && git pull');
        res.json({ mensagem: 'Pipeline executado com sucesso!' });
    }

});

// http.createServer(function (req, res) {
//     req.on('data', function (chunk) {
//         console.log(chunk.toString());
//         let sig = "sha1=" + crypto.createHmac('sha1', segredo).update(chunk.toString()).digest('hex');

//         if (req.headers['x-hub-signature'] == sig) {
//             exec('cd ' + repo + ' && git pull');
//         }
//     });

//     res.end();
// }).listen(8082);

app.listen(8082, function () {
    console.log('Projeto Pipeline rodando na porta 8082');
});
