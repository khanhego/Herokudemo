const express = require('express');
const engines = require('consolidate');
const app = express();
const mongodb = require('mongodb');
var http = require('http')
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
var MongoClient = mongodb.MongoClient;
var url = "mongodb+srv://dbDemo:Khanh260797@cluster0.zzpze.mongodb.net/ToyStore";

app.get('/', async function (req, res) {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let result = await dbo.collection("Users").find({}).toArray();
    let product = await dbo.collection("Products").find({}).toArray();
    let category = await dbo.collection("Category").find({}).toArray();
    // console.log(result)
    // console.log(product)
    res.render('index', { model: result, list: product, category: category });
})
app.get('/categories', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let category = await dbo.collection("Category").find({}).toArray();
    return category
})

app.get('/listProduct', async function (req, res) {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let product = await dbo.collection("Products").find({}).toArray();
    console.log(product)
    res.render('listProduct', { list: product });
})
app.get('/category', (req, res) => {
    res.render('category');
})


app.get('/register', function (req, res) {
    res.render('register');
})
app.get('/edit', function (req, res) {
    res.render('edit');
})

app.get('/showDataUser', async function (req, res) {
    let id = req.query.id;
    console.log("ahiiiiiiiiii", req.query)
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let result = await dbo.collection("Users").findOne({ _id: ObjectID(id) });
    console.log("data item", result)
    res.render('showDataUser', { model: result });
})
app.get('/editDataProduct', async function (req, res) {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let result = await dbo.collection("Products").findOne({ _id: ObjectID(id) });
    console.log("data item", result)
    res.render('editDataProduct', { model: result });
})
app.get('/filterCategory', async function (req, res) {
    let id = req.query.id;
    let name = req.query.name;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let result = await dbo.collection("Products").find({ category: name }).toArray();
    console.log("data ", result)
    res.render('showFilter', { model: result });
})
// app.get('/search', function (req, res) {
//     // res.render();
// })
// app.get('/search', async function (req, res) {
//     let info = req.query.info;
//     //var ObjectID = require('mongodb').ObjectID;
//     let client = await MongoClient.connect(url);
//     let dbo = client.db("ToyStore");
//     let result = await dbo.collection("Products").find({ name: new RegExp("^" + info, 'i') }).toArray();
//     // let result = await dbo.collection("Products").findOne({name : /.*d.*/i});;
//     console.log("data search123", result)
//     res.render('listProduct', { list: result });
// })

app.post('/doRegister', async (req, res) => {
    let inputName = req.body.txtName;
    let inputEmail = req.body.txtEmail;
    let inputPassword = req.body.txtPassword;
    let newAccount = { name: inputName, email: inputEmail, pass: inputPassword };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    await dbo.collection("Users").insertOne(newAccount); y
    res.redirect('/');//
})

app.get('/update', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let inputName = req.body.txtName;
    let inputEmail = req.body.txtEmail;
    let inputPassword = req.body.txtPassword;
    let updateInfo = { name: inputName, email: inputEmail, pass: inputPassword };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let result = await dbo.collection("Users").updateOne({ _id: ObjectID(id) }, { $set: updateInfo });
    console.log("Update data", result)
    res.redirect('/');

})

app.get('/updateProduct', async (req, res) => {
    let id = req.query.idProduct;
    console.log("khanh query", req.query)
    console.log("khanh body", id)
    var ObjectID = require('mongodb').ObjectID;
    let inputName = req.query.name;
    let price = req.query.price;
    let category = req.query.category;
    console.log("text", inputName)
    let updateInfo = { name: inputName, price: price, category: category };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    await dbo.collection("Products").updateOne({ _id: ObjectID(id) }, { $set: updateInfo });
    console.log('1234556')
    res.redirect('/');

})

app.post('/addProduct', async (req, res) => {
    let inputName = req.body.txtName;
    console.log(req.body.txtName)
    let inputPrice = req.body.txtPrice;
    let category = req.body.txtCategory;
    let newProduct = { name: inputName, price: inputPrice, category: category };
    let client = await MongoClient.connect(url);
    if (inputPrice>100) {
        console.log('abbc')
        
        let dbo = client.db("ToyStore");
        await dbo.collection("Products").insertOne(newProduct);
        res.redirect('/');//
    }
    else{
        let errorABC= {message : 'Giá không được nhỏ hơn 100'}
        res.render('insert', { error: errorABC });
    }
   

})

app.post('/add', async (req, res) => {
    let inputName = req.body.txtName;
    let inputPrice = req.body.txtPrice;
    let newCake = { name: inputName, price: inputPrice };
    let client = await MongoClient.connect(url);
    let dbo = client.db("Store");
    await dbo.collection("Cake").insertOne(newCake);
    res.redirect('/');


})

app.post('/addCategory', async (req, res) => {
    let inputName = req.body.txtName;
    let inputDes = req.body.txtDes;
    let newCategory = { name: inputName, description: inputDes };
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    await dbo.collection("Category").insertOne(newCategory);
    res.redirect('/');//
})


app.get('/insert', async function (req, res) {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let category = await dbo.collection("Category").find({}).toArray();
    console.log(category)
    res.render('insert', { category: category });
    // res.render('showData',{model:result});
})

app.get('/remove', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    await dbo.collection("Users").deleteOne({ _id: ObjectID(id) });
    await dbo.collection("Products").deleteOne({ _id: ObjectID(id) });
    await dbo.collection("Category").deleteOne({ _id: ObjectID(id) });
    console.log('1111111111')
    res.redirect('/');

})

const PORT = process.env.PORT || 3000;
app.listen(PORT);

