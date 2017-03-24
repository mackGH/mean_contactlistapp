var express = require('express');
var app = express();

//Define the 'body-parser' to extract http 'payload' from http requests.
var bodyParser = require('body-parser');
//Define 'mongoose' variable in order to interact with the mongodb
var mongoose = require('mongoose'); 

//Define the mongodb schema Contact: {name, number and email}
var dbSchema = mongoose.Schema({
	name: {type: String, required: true},
	number: {type: String, required: true},
	email: {type: String}
}, {collection: 'contacts'});

//Define the 'mongoose.model' to create, read, update, delete entries in mongodb base on the schema
var dbModel = mongoose.model("dbModel", dbSchema);

//Connects to mongodb in your server
mongoose.connect('mongodb://localhost/contactlistapp');
app.use(express.static(__dirname + '/public'));

//Use for extracting the payload from http requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Listens for http requests and maps it to a function in the server
app.post("/api/contactlist", createContact);
app.get("/api/contactlist", getAllContact);
app.get("/api/contactlist/:id", getContactById)
app.delete("/api/contactlist/:id", deleteContact);
app.put("/api/contactlist/:id", updateContact)

function createContact(req, res){
	//Parse the 'payload' and store it in local variable 'contact'
	var contact = req.body;
	//Use 'the mongoose.model' to create the entry in mongodb
	dbModel
		.create(contact)
		/*If creating new entry is successful, pass the mongodb data back to the client with 'function(postObj)'
		otherwise the server would pass a 'FAILED' status back to the client*/
		.then(
			function(postObj){
				res.json(200);
			},
			function(error){
				res.sendStatus(400);
			}
		);
}

function deleteContact(req, res){
	/*Get the contactId from the request. From 'app.delete' above, notice the server is listening for requests with
	address structure '/api/contactlist/:id'. In order to get the ':id', we use req.params.id*/
	var contactId = req.params.id;
	dbModel
		.remove({_id: contactId})
		.then(
			function(status){
				res.sendStatus(200);
			},
			function(){
				res.sendStatus(400);
		});
}

function getAllContact(req, res){
	dbModel
		//mongodb's 'find()' method gets ALL existing entries from the database
		.find()
		.then(
			//If get request was successful pass the 'contacts' json data back to the client
			function(contacts){
				res.json(contacts);
			},
			function(error){
				res.sendStatus(400);
			}
		);
}

function getContactById(req, res){
	dbModel
		//Find the specific 'contact' entry from the mongodb to be edited using _id
		.findById({_id: req.params.id})
		.then(
			//If requests is successful, pass that entry back to the client
			function(contact){
				res.json(contact);
			},
			function(error){
				res.sendStatus(400);
		});
}

function updateContact(req, res){
	//Get the 'updated' contact details from the http request payload
	var updatedContact = req.body;
	dbModel
		/*Update the entry whose '_id' matches the id from the request and 
		then update that specific entry in mongodb*/
		.update({_id: req.params.id}, {
			name: updatedContact.name,
			number: updatedContact.number,
			email: updatedContact.email
		})
		.then(
			function(status){
				res.json(200);
			},
			function(error){
				res.sendStatus(400);
		});
}
var port = process.env.PORT || 3000;

//Server would listen for incoming requests from port 3000
app.listen(port, function () {
  console.log('App listening on port ' + port);
});