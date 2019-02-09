const mongoose = require('mongoose');
const { Schema } = mongoose;

var articleShema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
    },
    content: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

var Articles = mongoose.model('Article', articleShema);

module.exports = Articles;