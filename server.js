const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
app.set('view engine','ejs');

app.use(express.urlencoded({ extended: true }));

app.use((res,req,next)=>{
    const deatails = {
        timestamp : new Date().toISOString()
    }

    const timestamp = JSON.stringify(deatails) + '\n';

    fs.appendFile('timestamp.log',timestamp,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('success in appending in the files.');
        }
    })
    
    next();

})

app.post('/add-task', (req, res) => {
    const newTask = { title: req.body.title };

    
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        let tasks = [];
        if (!err && data) {
            tasks = JSON.parse(data);
        }

    
        tasks.push(newTask);

        
        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving task.');
            }
            res.redirect('/tasks'); 
        });
    });
});



app.get('/task', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.send('No tasks available.');
        }

        const tasks = JSON.parse(data);
        res.render('task', { tasks }); 
    });
});



app.get('/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            return res.send('No tasks available.');
        }

        const tasks = JSON.parse(data);
        res.render('tasks', { tasks }); 
    });
});


app.get('/add-Task',(req,res)=>{
    res.render('addTask');
})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}/task`);
    console.log('http://localhost:3000/task');
})

