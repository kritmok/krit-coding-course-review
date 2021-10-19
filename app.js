//Server: Set up Server and its port

const express = require('express');
const app = express();

  //Server: declare static
app.use(express.static(__dirname + "/public"))

//Other dependencies
  //Body-parser - access what is posted
const bodyParser = require('body-parser');
  //Body-parser setup
app.use(bodyParser.urlencoded({ extended: false}));
  //Mongoose - save what is posted to the databse
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://krit:test1234@cluster0.hnned.mongodb.net/reviewDB?retryWrites=true&w=majority');
  //Lodash
const _ = require('lodash');

//Schema and model(collections) for this project
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model(
  'Post',
  postSchema
);

//View engine : Set up ejs as this project's view engine
const ejs = require('ejs');
app.set('view engine', 'ejs');

//set up routes
  //Home Route
app.get('/', (req, res) => {
  Post.find((err, posts) => {
    if(err){
      console.log(err);
    } else {
      res.render ("home", {posts : posts});
    }
  });

});

  //compose Route
app.get('/compose', (req,res) => {
  res.render("compose");
});


  //Manage what is posted
app.post('/', (req,res) => {

  const newpost = new Post ({
    title: req.body.title ,
    content: req.body.content
  }) ;

  newpost.save( (err, newpost) => {
    if(err){
      console.log(err);
    }});

  res.redirect("/");
})

  //dynamically create single-post page
app.get('/post/:postTitle', (req,res) => {

  const requestedTitle = _.lowerCase(req.params.postTitle);

  Post.find((err, posts) => {
    if(err){
      console.log(err);
    } else {

      posts.forEach((post) => {
        var postTitle = _.lowerCase(post.title);

        if( postTitle === requestedTitle) {
          res.render("post", { post: post });
        }
      })
    }
  });

})






// Server : Connect server to the port
app.listen(process.env.PORT || 3000)
