const urlBase = 'http://157.245.90.244/LAMPAPI';
const extension = 'php';

// Obtain logged in user's cookie
document.addEventListener('DOMContentLoaded', function()
{
    
    console.log("DOMContentLoaded event worked");
    console.log("All cookies:", document.cookie);

    const userId = getCookie("userId");
    console.log("UserId detected from cookie:", userId);

    // Send back to login page if unrecognized, fetch personal contacts otherwise
    if (!userId || userId <  1)
    {
        console.log("Invalid userId, redirecting back to login page");
        window.location.href="index.html";
    }
    else
    {
        console.log("Valid userId, fetching contacts");
        fetchContacts(userId);
    }

    // Log out the current user if logout button pressed
    document.getElementById('logoutButton').addEventListener('click', function(event)
    {
        logout();
    });

    var addContactModal = new bootstrap.Modal(document.getElementById('addContactModal'));

    document.querySelector('[data-bs-target="#addContactModal"]').addEventListener('click', function(event) {
        event.preventDefault();
        addContactModal.show();
    });

    document.getElementById('saveContactBtn').addEventListener('click', function() {
        addContact();
    });

    var editContactModal = new bootstrap.Modal(document.getElementById('editContactModal'));

    document.getElementById('saveEditContactBtn').addEventListener('click', function() {
        saveEditContact();
    });

    document.getElementById("searchInput").addEventListener("input", function() {
        const searchValue = this.value.trim();
        searchContacts(searchValue);
    });
});

function fetchContacts(userId)
{
    const xhr = new XMLHttpRequest();
    const url = `${urlBase}/SearchContacts.${extension}`;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            const contactsContainer = document.getElementById('contactsContainer');
            if (this.status == 200)
            {
                const response = JSON.parse(this.responseText);
                if (response.error || response.results.length === 0)
                {
                    displayNoContacts();
                }
                else
                {
                    displayContacts(response.results);
                }
            }
            else
            {
                contactsContainer.innerHTML = '<p class="text-center">Could not fetch contacts...</p>';
            }
        }
    };

    const jsonPayload = JSON.stringify({ userId: userId, search: "" });
    xhr.send(jsonPayload);
}

function displayContacts(contacts)
{
    const contactsContainer = document.getElementById('contactsContainer');

    if (contacts.length === 0)
    {
        displayNoContacts();
    }
    else
    {
        let tableHTML = `
        <table class="table table-dark table-striped table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tableBody">
        `;

        contacts.forEach(contact => {
            tableHTML += `
            <tr>
                <td>${contact.Name}</td>
                <td>${contact.Phone}</td>
                <td>${contact.Email}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-contact" data-id="${contact.ID}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-contact" data-id="${contact.ID}">Delete</button>
                </td>
            </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        contactsContainer.innerHTML = tableHTML;


        document.querySelectorAll('.edit-contact').forEach(button => {
            button.addEventListener('click', function() {
                editContact(this.getAttribute('data-id'), this);
            });
        });

        document.querySelectorAll('.delete-contact').forEach(button => {
            button.addEventListener('click', function() {
                deleteContact(this.getAttribute('data-id'), this);
            });
        });
    }
}

function displayNoContacts()
{
    const contactsContainer = document.getElementById('contactsContainer');

    contactsContainer.innerHTML = `
        <div class="card text-center">
            <div class="card-body">
                <h5 class="card-title">You have no contacts yet!</h5>
                <p class="card-text">Press 'Add' to begin.</p>
            </div>
        </div>
    `;
}

function getCookie(name)
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log("Cookie parts for", name, ":", parts);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to add a new contact
function addContact() {
    // Retrieve values from the input fields
    let name = document.getElementById("nameTextAdd").value;
    let phone = document.getElementById("phoneTextAdd").value;
    let email = document.getElementById("emailTextAdd").value;

    let userId = getCookie("userId");

    if (!name || !phone || !email)
    {
        alert("Please fill in all fields.");
        return;
    }

    // Prepare the payload with the new contact information
    let tmp = { Name: name, Phone: phone, Email: email, UserId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // Define the API endpoint URL for adding the contact
    let url = urlBase + '/CreateContact.' + extension;

    // Create an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
   xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    alert("Error adding contact: " + jsonObject.error);
                } else {
                    let modal = bootstrap.Modal.getInstance(document.getElementById('addContactModal'));
                    modal.hide();
                    document.getElementById("addContactForm").reset();
                    fetchContacts(userId);
                }
            } else {
                alert("Error adding contact: " + this.status);
            }
        }
    };
    xhr.send(jsonPayload);
}

// Function to edit an existing contact
function editContact(contactId, button)
{

    let row = button.closest('tr');
    let name = row.cells[0].textContent;
    let phone = row.cells[1].textContent;
    let email = row.cells[2].textContent;

    document.getElementById('editContactId').value = contactId;
    document.getElementById('editNameText').value = name;
    document.getElementById('editPhoneText').value = phone;
    document.getElementById('editEmailText').value = email;

    var editContactModal = new bootstrap.Modal(document.getElementById('editContactModal'));
    editContactModal.show();
}

function saveEditContact()
{
    let contactId = document.getElementById('editContactId').value;
    let name = document.getElementById('editNameText').value;
    let phone = document.getElementById('editPhoneText').value;
    let email = document.getElementById('editEmailText').value;

    let userId = getCookie("userId");

    if (!name || !phone || !email)
    {
        alert("Please fill in all fields.");
        return;
    }

    let tmp = { ID: contactId, Name: name, Phone: phone, Email: email };
    let jsonPayload = JSON.stringify(tmp);

    let url = `${urlBase}/ModifyContact.${extension}`;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

     xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    alert("Error adding contact: " + jsonObject.error);
                } else {
                    let modal = bootstrap.Modal.getInstance(document.getElementById('editContactModal'));
                    modal.hide();
                    fetchContacts(userId);
                }
            } else {
                alert("Error adding contact: " + this.status);
            }
        }
    };
    xhr.send(jsonPayload);
}

// Function to delete a contact
function deleteContact(contactId, button) {

    if(!confirm("Are you sure you want to delete this contact?"))
        return;

    let userId = getCookie("userId");
    let contactName = button.closest('tr').querySelector('td:first-child').textContent;

    console.log("Deleting contact with Name:", contactName);
    console.log("User ID:", userId);

    // Prepare the payload with the contact ID to be deleted
    let tmp = {Name: contactName, UserID: userId};
    let jsonPayload = JSON.stringify(tmp);

    // Define the API endpoint URL for deleting the contact
    let url = urlBase + '/DeleteContact.' + extension + '?v=' + new Date().getTime();

    // Create an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log("Response status:", this.status);
            console.log("Response text:", this.responseText);
            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    alert("Error deleting contact: " + jsonObject.error);
                } else {
                    button.closest('tr').remove();
                    if (document.querySelectorAll('#tableBody tr').length === 0)
                        displayNoContacts();
                }
            } else {
                alert("Error deleting contact. Server returned status: " + this.status);
            }
        }
    };
    xhr.send(jsonPayload);
}
function checkForNoContacts() {
    const tableBody = document.getElementById("tableBody");

    if (!tableBody || tableBody.querySelectorAll('tr').length === 0)
        displayNoContacts();
}

// Function to search for contacts
function searchContacts(searchValue) {

    const userId = getCookie("userId");

    // Define the API endpoint URL for searching contacts
    let url = urlBase + '/SearchContacts.' + extension;

    // Create an XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            const contactsContainer = document.getElementById('contactsContainer');
            if (this.status == 200) {
                const response = JSON.parse(this.responseText)
                if (response.error) {
                    contactsContainer.innerHTML = '<p class="text-center">No contacts found!</p>';
                } else {
                    displayContacts(response.results);
                }
            } else {
                contactsContainer.innerHTML = '<p class="text-center">Could not fetch contacts!</p>';
            }
        }
    };

    let tmp = { userId: userId, search: searchValue };
    let jsonPayload = JSON.stringify(tmp);
    xhr.send(jsonPayload);
}

// Function to log out the user
function logout()
{
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "index.html";
}
