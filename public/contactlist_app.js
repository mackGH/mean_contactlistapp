(function(){
	angular
		/*Defines this javascript file as an AngularJS app:
		should be the same as Defined in 'ng-app' from index.html*/
		.module("ContactListApp", [])
		//Defines the controller for the <div> tag and maps to a function 'AppController'
		.controller("AppController", AppController)

	/*Defines the function 'AppController': $scope for MANAGING AND PASSING DATA
	BETWEEN THE HTML page and JS SCRIPT. $http for sending requests to the node.js server*/
	function AppController($scope, $http){
		//Define the functions for easy searching
		$scope.createContact = createContact;
		$scope.clearFields = clearFields;
		$scope.deleteContact = deleteContact;
		$scope.editContact = editContact;
		$scope.updateContact = updateContact;
		
		//Get All existing contacts the first time you load index.html
		init();
		function init(){
			$scope.editing = false;
			getAllContact();
		}
		
		function clearFields(){
			/*'$scope.contact' is binded in the 'contact' variable in index.html
			and setting the value to null to clear the input fields*/
			$scope.contact = null;
		}
		
		//Defines 'createContact()' function and accepts the 'contact' parameter from index.html
		function createContact(contact){
			/*Sends 'http post' request including the 'contact' data to the server for creating new entry to the mongodb.
			If the response from the server is successful, reloads the page and clear the input fields*/
			$http
				.post("/api/contactlist", contact)
				.success(getAllContact);
			clearFields();
		}
		
		//Defines 'deleteContact()' function and accepts the 'contactId' parameter from index.html
		function deleteContact(contactId){
			/*Sends 'http delete' request including the 'contact._id' in order to delete a specific 
			contact to the mongodb. If the response from the server is successful, reload the page*/
			$http
				.delete("/api/contactlist/" + contactId)
				.success(getAllContact);
		}
		
		//Defines 'editContact()' function and accepts the 'contactId' parameter from index.html
		function editContact(contactId){
			$scope.editing = true;
			/*Sends 'http get' request including the 'contact._id' in order to edit a specific 
			contact to the mongodb. If the response from the server is successful, reload the page*/
			$http
				.get("/api/contactlist/" + contactId)
				.success(
					function(contact){
						$scope.contact = contact;
				});
				console.log($scope.editing);
		}
		
		//Defines 'getAllContact()' function to get existing contacts from the mongodb
		function getAllContact(){
			/*Sends 'http get' request to get existing contacts from the mongodb. If the response from the server is successful,
			pass the 'contacts' variable from the server to $scope in order to populate the table in index.html*/
			$http
				.get("/api/contactlist")
				.success(
					function(contacts){
						$scope.contacts = contacts;
				});
		}
		
		//Defines 'updateContact()' function to update a 'contact' entry from the mongodb by _id
		function updateContact(contact){
			$scope.editing = false;
			/*Sends 'http put' request to modify an existing contact from the mongodb. 
			If the response from the server is successful, reload the page and clear the fields*/
			$http
				.put("/api/contactlist/" + contact._id, contact)
				.success(getAllContact);
			clearFields();
		}
	}
})();