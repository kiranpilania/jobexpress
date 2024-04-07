const fs = require('fs');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();

const port = process.env.PORT||3000;

const publicDirectoryPath = path.join(__dirname, '/public');
const viewPath = path.join(__dirname, '/template/views');
const partialPath = path.join(__dirname, '/template/partials');

app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialPath);

app.use(express.static(publicDirectoryPath));


const job_dataNotes = function () {
    try {
        const dataBuffer = fs.readFileSync('data.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
};


app.get('', (req, res) =>
{
    res.render('index',{
        title: 'Job Hunt',
        name: 'My Name'
    })
})





app.get('/showjobdetails', (req, res) =>
{
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        const jsonData = JSON.parse(data);
        res.render('showjobdetails', { jsonData: jsonData, title: 'Job_Hunt' });
    });

    
})




app.listen(port, () =>{
    console.log("server is up on port 3000");
})


