const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
const port = 8080;

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite'
});

// Define Callcard model
class Callcard extends Model { }
Callcard.init({
    cc_no: DataTypes.STRING,
    cc_address: DataTypes.STRING,
    cc_status: DataTypes.STRING,
    cc_info: DataTypes.STRING,
    cc_agency: DataTypes.STRING
}, { sequelize, modelName: 'callcard' });

// Sync models with database
sequelize.sync();

//cors option
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//enable cors - allow all users
app.use(cors(corsOptions));


// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET all callcards
app.get('/api/callcard', async (req, res) => {
    const callcard = await Callcard.findAll();
    res.json(callcard);
});

//GET callcard by id
app.get('/api/callcard/:id', async (req, res) => {
    const callcardbyid = await Callcard.findByPk(req.params.id);
    res.json(callcardbyid);
});

//POST create new callcard
app.post('/api/callcard', async (req, res) => {
    const newcallcard = await Callcard.create(req.body);
    res.json(newcallcard);
});

//PUT update callcard
app.put('/api/callcard/:id', async (req, res) => {
    const callcardToUpdate = await Callcard.findByPk(req.params.id);
    if (callcardToUpdate) {
        await callcardToUpdate.update(req.body);
        res.json(callcardToUpdate);
    } else {
        res.status(404).json({ message: 'Callcard not found' });
    }
});

//DELETE callcard
app.delete('/api/callcard/:id', async (req, res) => {
    const callcardToDelete = await Callcard.findByPk(req.params.id);
    if (callcardToDelete) {
        await callcardToDelete.destroy();
        res.json({ message: 'Callcard deleted' });
    } else {
        res.status(404).json({ message: 'Callcard not found' });
    }
});


//api call - GET
app.get('/api/welcome', (req, res) => {
    res.send('Welcome to GFIS webCAD API v1');
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});