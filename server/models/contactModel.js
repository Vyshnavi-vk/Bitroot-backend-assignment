const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    phoneNum: {
        type: [String]
    },
    image: {
        type: String,
        default: "",
    },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;


