
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog')
const app = express();


const dburi = 'mongodb://localhost:27017/prac';

app.set('view engine','ejs')
app.use(morgan('dev'))
app.use(express.static('sty'))
app.use(express.urlencoded({extended:true}))

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected to db')
        app.listen(3000,()=>{
            console.log('listening')
        })
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
});

app.get('/',(req,res)=>{
   res.redirect('/blogs')
});

app.get('/blogs',(req,res)=>{
    Blog.find()
    .then((result)=>{
        res.render('home',{con:result,t:'home'})
    })
    .catch((err)=>{
        console.log(err)
    })
});

app.post('/n',(req,res)=>{
    const blog =new Blog(req.body)
    blog.save()

    .then((result)=>{
        res.redirect('/blogs')
    })
    .catch((err)=>{
        console.log(err)
    })
});
app.get('/blogs/:id',(req,res)=>{

    Blog.findById(req.params.id)
    .then((result)=>{
        res.render('blog',{t:'blog',con:result})
    })
    .catch((err)=>{
        var p =req.url
        res.render('404',{p:p,t:'404page'})
        console.log(err)
    })
});
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            res.status(500).json({ error: 'Something went wrong' });
        });
});
app.get('/c',(req,res)=>{
    res.render('contact',{t:'contact'})
});
app.get('/a',(req,res)=>{
    res.render('about',{t:'about us'})
});
app.get('/n',(req,res)=>{
    res.render('newblog',{t:'new blog'})
});
app.use((req,res)=>{
    var p =req.url
    res.render('404',{p:p,t:'404page'})
});