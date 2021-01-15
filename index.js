const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const unirest = require('unirest');
const moment = require('moment')
const app = express();

const port = process.env.PORT || 3000;
const b3Url = process.env.B3 || 'https://arquivos.b3.com.br/apinegocios/ticker'

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/options/:ticket', (req, res) => {
	const ticket = req.params.ticket;
	let date = moment();
	if (date.day() == 0) { 
		date = date.subtract(1, 'days');
	} else if (date.day() == 6) {
		date = date.subtract(2, 'days');
	} else if (date.hour() < 11) {
		date = date.subtract(1, 'days');
	}
	unirest.get(`${b3Url}/${ticket}/${date.format('YYYY-MM-DD')}`)
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
		.then((response) => {
			const result = response.body;
			if (!result || result.values.length == 0)
				return res.status(404).json({
					status: 404,
					message: `${ticket} não encontrado.`
				});
			return res.json({
				price: result.values[0][2],
				date: result.values[0][4],
				hour: result.values[0][5]
			});
		})
});

app.listen(port, () => console.log(`Listening on port ${port}!`));