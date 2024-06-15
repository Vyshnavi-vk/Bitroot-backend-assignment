const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');
const contactRoutes = require('./routes/contactRoutes');
const { createContactController, updateContactController } = require('./controllers/contactController');

dotenv.config();
const app = express();
app.use(express.json());
connectDB();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "public", "assets"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send("Contact created")
})

app.get('/api/contact/create', (req, res) => {
    res.render("upload")
})


app.post("/api/contact/create", upload.single("image"), createContactController);
app.put("/api/contact/update/:id", upload.single("image"), updateContactController);


app.use('/api/contact', contactRoutes)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});



module.exports = app