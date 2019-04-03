/* Importação de dependencias */
const express = require('express');
const crypto = require('crypto');
const cors = require("cors");
const bodyParser = require("body-parser");
const exec = require('child_process').exe;

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
    console.log(req.body);
    const assinatura = "sha1=" + crypto.createHmac('sha1', segredo).update(req.body.toString()).digest('hex');
    if (req.headers['x-hub-signature'] == assinatura) {
        exec('cd ' + repositorio + ' && git pull');
        res.json({ mensagem: 'Pipeline executado com sucesso!' });
    }

});

app.listen(8082, function () {
    console.log('Projeto Pipeline rodando na porta 8082');
});
