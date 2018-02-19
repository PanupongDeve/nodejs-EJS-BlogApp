const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

// const config = require('./config'); //if development use must use config.js 
const app = express();

const PORT = process.env.PORT || 5000

//-------------------- Connect Database-----------------------------------

//input user name and password forn config

const DB_username = process.env.DBusername || config.mongoDB.username;
const DB_password = process.env.DBpassword || config.mongoDB.password;

mongoose.connect(`mongodb://${DB_username}:${DB_password}@ds249605.mlab.com:49605/blogappta`);

const db = mongoose.connection;

// if ERROR
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Database connection!!');
});

//----------------------------------------------------------------------------------------


//--------------------SETUP App express MIDDLEWARE -----------------------------

//Select template
app.set("view engine","ejs");

//use static folder
app.use(express.static('public'));

//config urlencode
app.use(bodyParser.urlencoded({ extended: true}));

//----------------------------------------------------------------

//---------------- Setup Model AND SCHEMA IN MONGODB-------------------------

// create Schema
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now} // default = intitial value
});

//create Model
const Blog = mongoose.model('Blog', blogSchema);

// //testModel
// Blog.create({
//     title: 'Test Blog',
//     image: 'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
//     body: 'Hello Test Blog'
// });

//--------------------------------------------------------------

//------------------- RESTFUL ROUTES----------------------------
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log('ERROR!');
        } else {
            //res.rednder('file ejs', {object data to send client} );
            res.render('index', {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render("new");
})

//CREATE ROUTE
app.post('/blogs', (req,res) => {
    //create blog
    Blog.create(req.body.blog, (err, newBlog) => {
       if(err) {
           res.render('new');
       } else {
           //then, redirect to the index
           res.redirect('/blogs');
       }
    });
    
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});
//--------------------------------------------------------------


//open serve
app.listen(PORT, () => {
    console.log(`Server is running... at ${PORT}`);
});


