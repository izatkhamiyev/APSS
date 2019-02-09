const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var fs = require('fs');
var authenticate = require('../authenticate');

const Articles = require('../models/articles');

const articleRouter = express.Router();

articleRouter.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        date = new Date().getTime().toString();
        cb(null, date + file.originalname)
    }
});

const imageFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|JPG|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
}

const upload = multer({storage: storage, fileFilter: imageFilter});

articleRouter.route('/')
.get((req, res, next) => {
    Articles.find({})
    .then((articles) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(articles);
    }, err => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    console.log(req.body);
    req.body.image = '/images/' + req.file.filename;
    Articles.create(req.body)
    .then((article) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'applicatoin/json');
        res.json(article);
    }, err => next(err))
    .catch(err => next(err));
})

articleRouter.route('/:articleId')
.get((req, res, next) => {
    Articles.findById(req.params.articleId)
    .then((article) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(article);
    }, err => next(err))
    .catch(err => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    Articles.findById(req.params.articleId)
    .then((article) => {
        fs.unlink('public' + article.image, (err) => {});
        req.body.image = '/images/' + req.file.filename;
        Articles.findByIdAndUpdate(req.params.articleId, { $set: req.body}, {new: true})
        .then((article) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'applicatoin/json');
            res.json(article);
        }, err => next(err))
        .catch(err => next(err));
    }, err => next(err))
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Articles.findByIdAndRemove(req.params.articleId)
    .then((article) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'applicatoin/json');
        res.json(article);
        fs.unlink('public' + article.image, (err) => {});
    }, err => next(err))
    .catch(err => next(err));
})

module.exports = articleRouter;