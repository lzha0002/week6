//import packages
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//import module mangodb
const mongodb = require('mongodb');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Setup the static assets directories
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('css'));
app.use(morgan('common'));

app.listen(8080);

//Initialise a database (Array) and push some dummy data
let db;

//define url for db server
//get reference to mandoclient
//connect to server using client
//can be find in sample code
const url = "mongodb://localhost:27017/";
const MongoClient = mongodb.MongoClient;
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("taskDB");
            //db.createCollection('task');
        }

    });



app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/newtask', function (req, res) {
    //res.sendFile(__dirname+'views/newtask.html');
    res.render('newtask.html');
});

app.post('/listtasks', function (req, res) {
    let newId = Math.round(Math.random() * 1000);
    db.collection('task').insertOne (
        {
            taskID: newId,
            taskName: req.body.taskname,
            dueDate: req.body.duedate,
            description: req.body.taskdesc,
            taskStatus: req.body.taskstatus,
            assignTo: req.body.assignto

        }
    );
    //res.render('listtasks.html', { taskDB: db });
    //db.insertOne(objectToInsert,callback);
    res.redirect('/listtasks');

});



app.get('/listtasks', function (req, res) {
    //db.find() - get a sursor 
    db.collection('task').find({}).toArray(function (err, data) {
        res.render('listtasks.html', { taskDB: data });
        console.log(data);
    });

});

// app.get ('/deleteWithId',function(req,res){
//     res.render('listtasks.html');
// });

app.post('/deleteWithId', function (req, res) {
    //let filter = { taskID: req.body.taskid2};
    db.collection('task').deleteOne({ taskID: parseInt(req.body.taskid2)}, function (err) { });
    //extract taskID from req body
    //db.deleteOne(ctiteria,callback) -- inside callback
    res.redirect('/listtasks');

});
app.get ('/update',function(req,res){
    res.render('listtasks.html');
});
app.post('/updateStatus', function (req, res) {
    //let userDetails = req.body;
   // let filter = { taskID: parseInt(req.body.taskid2 )};
    //let theUpdate = { $set: { taskStatus: req.body.taskstatus } };
    db.collection('task').updateOne({ taskID: parseInt(req.body.taskid )}, { $set: { taskStatus: req.body.taskStatus1 } });
   // db.collection('task').updateOne({ taskID: req.body.taskid }, theUpdate);
    //extract taskID from req body
    //db.updateOne(ctiteria,updates,callback)  -- inside callback
    res.redirect('/listtasks');

});

app.get('/deleteCompletedtask', function (req, res) {
    //let theDelete = {taskStatus: 'Complete',dueDate : {$lt : "2019-09-03"}};
    let theDelete = {taskStatus: 'Complete'};
    
    db.collection('task').deleteMany(theDelete, function (err) { });
    //db.deleteMany(ctiteria,callback) -- inside callback
    res.redirect('/listtasks');
});