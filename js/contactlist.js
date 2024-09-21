const urlBase = 'http://157.245.90.244/LAMPAPI';
const extension = 'php';

// Function to add a new contact
function addContact() {
    // Retrieve values from the input fields
    let name = document.getElementById("nameTextAdd").value;
    let phone = document.getElementById("phoneTextAdd").value;
    let email = document.getElementById("emailTextAdd").value;
    let userId = document.getElementById("useridTextAdd").value;

    // Clear any previous result message
    document.getElementById("contactAddResult").innerHTML = "";

    // Prepare the payload with the new contact information
    let tmp = { Name: name, Phone: phone, Email: email, UserId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // Define the API endpoint URL for adding the contact
    let url = urlBase + '/CreateContact.' + extension;

    // Create an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        // Handle the response from the server
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Display success message if the contact was added successfully
                document.getElementById("contactAddResult").innerHTML = "Contact has been added.";
            }
        };
        // Send the JSON payload to the server
        xhr.send(jsonPayload);
    } catch (err) {
        // Display error message if something goes wrong
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

// Function to edit an existing contact
function editContact(contactId) {
    // Retrieve updated contact information from input fields
    let name = document.getElementById("nameTextEdit").value;
    let phone = document.getElementById("phoneTextEdit").value;
    let email = document.getElementById("emailTextEdit").value;
    let userId = document.getElementById("useridTextEdit").value;

    // Clear any previous result message
    document.getElementById("contactEditResult").innerHTML = "";

    // Prepare the payload with the updated contact information
    let tmp = { Name: name, Phone: phone, Email: email, UserId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // Define the API endpoint URL for editing the contact
    let url = urlBase + '/ModifyContact.' + extension;

    // Create an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        // Handle the response from the server
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Display success message if the contact was modified successfully
                document.getElementById("contactEditResult").innerHTML = "Contact has been modified.";
            }
        };
        // Send the JSON payload to the server
        xhr.send(jsonPayload);
    } catch (err) {
        // Display error message if something goes wrong
        document.getElementById("contactEditResult").innerHTML = err.message;
    }
}

// Function to delete a contact
function deleteContact(contactId) {
    // Clear any previous result message
    document.getElementById("contactDeleteResult").innerHTML = "";

    // Prepare the payload with the contact ID to be deleted
    let tmp = { ContactId: contactId };
    let jsonPayload = JSON.stringify(tmp);

    // Define the API endpoint URL for deleting the contact
    let url = urlBase + '/DeleteContact.' + extension;

    // Create an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        // Handle the response from the server
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Display success message and refresh the page after the contact is deleted
                document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted.";
                location.reload(); // Reload the page to refresh the contact list
            }
        };
        // Send the JSON payload to the server
        xhr.send(jsonPayload);
    } catch (err) {
        // Display error message if something goes wrong
        document.getElementById("contactDeleteResult").innerHTML = err.message;
    }
}

// Function to search for contacts
function searchContacts() {
    // Retrieve search query from input fields
    let searchName = document.getElementById("nameSearchText").value;
    let searchUserId = document.getElementById("useridSearchText").value;

    // Clear any previous result message
    document.getElementById("contactSearchResult").innerHTML = "";

    // Prepare the payload with the search criteria
    let tmp = { search: searchName, userId: searchUserId };
    let jsonPayload = JSON.stringify(tmp);

    // Define the API endpoint URL for searching contacts
    let url = urlBase + '/SearchContacts.' + extension;

    // Create an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        // Handle the response from the server
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Display success message and populate the search results
                document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved.";
                let jsonObject = JSON.parse(xhr.responseText);

                // Build the contact list from the search results
                let contactList = "";
                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += jsonObject.results[i].Name + " - " + jsonObject.results[i].Phone + " - " + jsonObject.results[i].Email;
                    if (i < jsonObject.results.length - 1) {
                        contactList += "<br />\r\n";
                    }
                }

                // Display the contact list in the designated HTML element
                document.getElementById("contactText").innerHTML = contactList;
            }
        };
        // Send the JSON payload to the server
        xhr.send(jsonPayload);
    } catch (err) {
        // Display error message if something goes wrong
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

// Function to log out the user
function logout() {
    // Clear session or token data (e.g., from localStorage or sessionStorage)
    localStorage.removeItem("userToken"); // Remove token from localStorage
    sessionStorage.removeItem("userToken"); // Remove token from sessionStorage

    // Redirect to the login page after clearing the session/token
    window.location.href = "index.html"; // Redirect to the login page 
	}

// Bind the logout button to the logout function
document.querySelector('.btn.btn-outline-dark.ms-auto').addEventListener('click', function(event) {
	event.preventDefault(); // Prevent default behavior of the link
    logout(); // Call the logout function
});
