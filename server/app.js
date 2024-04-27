
const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const fileupload = require('express-fileupload');

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileupload());

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on the port number ${PORT}`));

//Configuration for MongoDB
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);

//Simple Web API
app.get('/klef/cse', async function(req, res){
    //res.send("Computer Science and Engineering");
    res.json("Computer Science");
});

app.post('/klef/klu', async function(req, res){
    //res.send("Computer Science and Engineering");
    res.json("K L University");
});


//REGISTRATION MODULE
app.post('/registration/signup', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('auc');
        users = db.collection('users');
        data = await users.insertOne(req.body);
        res.json("Registered Successfully...");
        conn.close();
    }catch(err)
    {
        res.json(err).status(404);
    }
    //res.json(req.body);
});

//LOGIN MODULE
app.post('/login/signin', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('auc');
        users = db.collection('users');
        data = await users.count(req.body);
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//HOME MODULE
app.post('/home/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('auc');
        users = db.collection('users');
        data = await users.find(req.body, {projection : {firstname: true, lastname : true }}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('auc');
        menu = db.collection('menu');
        data = await menu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('auc');
        menu = db.collection('menus');
        data = await menu.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//CHANGE PASSWORD
app.post('/cp/updatepwd', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('auc');
        users = db.collection('users');
        data = await users.updateOne({emailid:req.body.emailid}, {$set:{pwd: req.body.pwd}});
        conn.close();
        res.json("Password has been Updated..");
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//MyPROFILE
app.post('/myprofile/userinfo', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('auc');
        users = db.collection('users');
        data = await users.find(req.body).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//FILE UPLOAD
app.post('/uploaddp', async function(req, res){
    try
    {
        if(!req.files)
            return res.json("File not found");

        let myfile = req.files.myfile;
        var fname = req.body.fname;
        myfile.mv('../src/images/photo/'+ fname +'.jpg', function(err){
            if(err)
                return res.json("File upload operation failed!");

            res.json("File uploaded successfully...");
        });

        conn = await client.connect();
        db = conn.db('auc');
        users = db.collection('users');
        data = await users.updateOne({emailid: req.body.fname},{$set:{imgurl: fname + '.jpg'}});
        conn.close();

    }catch(err)
    {
        res.json(err).status(404);
    }
});
// In your Express backend code

// Suppose you have a collection named 'items' in your MongoDB
app.get('/items', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('auc');
        items = db.collection('items');
        const data = await items.find({}).toArray();
        conn.close();
        res.json(data);
    } catch(err) {
        res.json(err).status(500);
    }
}); 