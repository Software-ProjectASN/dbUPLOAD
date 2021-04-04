const express = require ('express');
const path = require('path');
const crypto= require('crypto');
const mongoose= require('mongoose');
const multer= require('multer');
const GridFsStorage= require('multer-gridfs-storage');
const Grid= require('gridfs-stream');
const methodOverride = require ('method-override');
const bodyParser= require ('body-parser');

const app = express();


//middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

//MongoURI
const MongoURI= 'mongodb+srv://Ashley:123pass@cluster0.nfj6c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//create mongo connection
const conn= mongoose.createConnection(MongoURI);

//init gfs
let gfs;

conn.once('open', () => {
     gfs=Grid (conn.db, mongoose.mongo);
gfs.collection('uploads');
})

//create storage engine
const storage = new GridFsStorage({
    url: MongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {//used to generate names
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);//if no error
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'//should match collection name
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });
//@route GET
//@dec Loads from


app.get('/', (req, res)=> {
res.render('index');
});

//posts /upload
//Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => { //upload.single can be changed to accept an array of files
    res.json({file: req.file});
});



const port= 5000;

app.listen(port, () => console.log('server started on port ${port}'));
