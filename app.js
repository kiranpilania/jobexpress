const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const app = express();



const port = process.env.PORT||3000;

const publicDirectoryPath = path.join(__dirname, '/public');
const viewPath = path.join(__dirname, '/template/views');
const partialPath = path.join(__dirname, '/template/partials');
app.use(bodyParser.json());

app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialPath);
app.use(express.static(publicDirectoryPath));



const job_dataNotes = function (skill) {
    try {
        const dataBuffer = fs.readFileSync('data.json');
        const dataJSON = dataBuffer.toString();
        const allJobs = JSON.parse(dataJSON);
        
        // Filter jobs based on skill
        if (skill) {
            return allJobs.filter(job => job.skillsrequired.includes(skill));
        } else {
            return allJobs; // Return all jobs if no skill provided
        }
    } catch (e) {
        console.error('Error reading data:', e);
        return [];
    }
};

app.get('', (req, res) =>
{
    res.render('index',{
        title: 'Job Sync',
        name: 'My Name'
    })
})

app.get('/showjobdetails', (req, res) => { 
    const skill = req.query.skills;
    const name = req.query.name;
    const jsonData = job_dataNotes(skill);
    res.render('showjobdetails', { jsonData: jsonData, title: 'Job Hunt', name: name }); 
})




app.get('/about', (req, res) =>
{
    res.render('about',{
        title: 'Job Sync',
    })
})

app.get('/topjobs', (req, res) =>
{
    res.render('topjobs',{
        title: 'Job Sync',
    })
})


app.post('/applyJob', (req, res) => {
    const dataToSave = req.body;
    
    // Write data to JSON file
    fs.readFile('job_applications.json', 'utf8', (err, data) => {
       if (err) {
          console.error(err);
          res.status(500).send('Error saving data');
          return;
       }
       
       let jobApplications = [];
       if (data) {
          jobApplications = JSON.parse(data);
       }
       
       jobApplications.push(dataToSave);
 
       fs.writeFile('job_applications.json', JSON.stringify(jobApplications, null, 2), err => {
          if (err) {
             console.error(err);
             res.status(500).send('Error saving data');
             return;
          }
          console.log('Data saved successfully');
          res.send('Data saved successfully');
       });
    });
 });


 

 app.get('/appliedjob', (req, res) =>
 {
     fs.readFile('job_applications.json', (err, job_applications) => {
         if (err) throw err;
         const jsonData = JSON.parse(job_applications);
         res.render('appliedjob', { jsonData: jsonData, name: '' });
     });
 })

 
//to remove any particular data from applied job data
 const jobApplications = JSON.parse(fs.readFileSync('job_applications.json'));
 app.delete('/removeJob/:jobId', (req, res) => {
    const jobId = req.params.jobId;

    // Remove the job with the specified jobId from the data
    const updatedJobApplications = jobApplications.filter(job => job.jobid !== jobId);

    // Update the data file with the updated job applications data
    fs.writeFileSync('job_applications.json', JSON.stringify(updatedJobApplications, null, 2));

    // Send a success response
    res.status(200).send('Job removed successfully');
});









app.listen(port, () =>{
    console.log("server is up on port 3000");
})


