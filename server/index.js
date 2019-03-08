//Load express module with `require` directive
var express = require('express')
var multer  = require('multer')
var Tesseract = require('tesseract.js')
let resolvers = require("../src/graphql/resolversExpress");

const { createApolloFetch } = require('apollo-fetch');

const fetch = createApolloFetch({
  uri: 'http://192.168.99.100:4466',
});


// You can also easily pass variables for dynamic arguments



 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    Tesseract.recognize(file)
    .progress(function  (p) { console.log('progress', p)    })
    .then(function (result) { console.log('result', result) })

    cb(null, file.originalname)
  }

  
  
})



var upload = multer({ storage: storage })
const bodyParser = require('body-parser');
var app = express();

// server.applyMiddleware({ app });


app.use(bodyParser.json())

//Define request response in root URL (/)
app.get('/', function (req, res) {
  res.send('Hello BlueCoding!')
})

//Launch listening server on port 8081
app.listen(8081, function () {
  console.log('app listening on port 8081!')
})


/**
 * Since the OCR wouldn't get the text correctly from the pictures and due to time I simulated a json with data that 
 * Typically we would get from a label and we send it to our express server via POST to make a mutation on our GraphQL server
 * downbelow you can find a json example sent to the /imgSimulate endpoint
 * EXP:
 * 
 * {
    "name": "AG MOUNTAINVIEW CHARDONNAY",
    "grapes": [
          "SYRAH"
        ],
    "winery":"RoqueCo",
    "alcohol": 13,
    "year": 2008,
    "price":200
}
 */
app.post('/imgSimulate', function (req, res) {
  fetch({
    query: `
    mutation createWine(
      $name: String!
      $grapes: [WineGrapes!]
      $winery: String
      $year: Int
      $alcohol: Float
      $price: Float
    ) {
      createWine(
        data: {
          name: $name
          grapes: { set: $grapes }
          winery: $winery
          year: $year
          alcohol: $alcohol
          price: $price
        }
      ) {
        id
        name
        grapes
        winery
        year
        alcohol
        price
      }
    }
  `,
    variables: {
      name: req.body.name,
      grapes: req.body.grapes,
      winery: req.body.winery, 
      year: req.body.year, 
      alcohol: req.body.alcohol,
      price: req.body.price
    },
  }).then(res => {
    console.log(res.data);
  });
    res.send("DONE");
  })


  app.post('/newimg', upload.single('file-to-upload'), (req, res) => {    
    let myImage = req.file.destination+req.file.filename;
     console.log("This is path ==>",myImage);
     console.log("req file",req.bodyParser);

    res.send(req.bodyParser.name);
  });


  