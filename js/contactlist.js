const urlBase = 'http://group3cop4331.com/LAMPAPI';
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
        fetchContacts(userId); // Displays any contacts if no error
    }

    // Log out the current user if logout button pressed
    document.querySelector('.btn.btn-outline-info.ms-5.me-3').addEventListener('click', logout);

    // Add contact eventListeners
    var addContactModal = new bootstrap.Modal(document.getElementById('addContactModal'));
    document.querySelector('[data-bs-target="#addContactModal"]').addEventListener('click', function(event) 
    {
        event.preventDefault();
        document.getElementById("nameInputAdd").value = "";
        document.getElementById("phoneInputAdd").value = "";
        document.getElementById("emailInputAdd").value = "";
        document.getElementById("nameInputAdd").classList.remove('invalid-regex');
        document.getElementById("phoneInputAdd").classList.remove('invalid-regex');
        document.getElementById("emailInputAdd").classList.remove('invalid-regex');
        document.getElementById("nameFeedbackAdd").textContent = "";
        document.getElementById("emailFeedbackAdd").textContent = "";
        document.getElementById("phoneFeedbackAdd").textContent = "";
        addContactModal.show();
    });
    document.getElementById('nameInputAdd').addEventListener('input', event => validateName(event.target, 'nameFeedbackAdd'));
    document.getElementById('emailInputAdd').addEventListener('input', event => validateEmail(event.target, 'emailFeedbackAdd'));
    document.getElementById('phoneInputAdd').addEventListener('input', event => validatePhone(event.target, 'phoneFeedbackAdd'));
    document.getElementById('saveAddContactBtn').addEventListener('click', addContact);

    // Edit Contact eventListeners
    document.getElementById('editNameInput').addEventListener('input', event => validateName(event.target, 'nameFeedbackEdit'));
    document.getElementById('editEmailInput').addEventListener('input', event => validateEmail(event.target, 'emailFeedbackEdit'));
    document.getElementById('editPhoneInput').addEventListener('input', event => validatePhone(event.target, 'phoneFeedbackEdit'));
    document.getElementById('saveEditContactBtn').addEventListener('click', saveEditContact);
    
    // Search Contacts eventListeners
    document.getElementById("searchInput").addEventListener("input", function() 
    {
        const searchValue = this.value.trim();
        searchContacts(searchValue);
    });
});

function validateEmail(inputElement, feedbackId)
{
    const emailInput = inputElement.value;
    const emailFeedback = document.getElementById(feedbackId);
    const emailRegex = /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (emailRegex.test(emailInput)) 
    {
        emailFeedback.textContent = "";
        inputElement.classList.remove('invalid-regex');
        return true;
    } else 
    {
        emailFeedback.textContent = "*Check the format of the Email Address";
        inputElement.classList.add('invalid-regex');
        return false;
    }
}

function validatePhone(inputElement, feedbackId)
{
    const phoneInput = inputElement.value;
    const phoneFeedback = document.getElementById(feedbackId);
    const phoneRegex = /^(\+(([1-9]{1,2}-[0-9]{3,4})|([1-9]{1,3})) )?((((\([0-9]{3}\) ?)|([0-9]{3}-))[0-9]{3}-[0-9]{4})|[0-9]{10})$/;

    if (phoneRegex.test(phoneInput)) 
    {
        phoneFeedback.textContent = "";
        inputElement.classList.remove('invalid-regex');
        return true;
    } else 
    {
        phoneFeedback.textContent = "*Check the format of the Phone Number";
        inputElement.classList.add('invalid-regex');
        return false;
    }
}

function validateName(inputElement, feedbackId)
{
    const inputLength = inputElement.value.length;
    const nameFeedback = document.getElementById(feedbackId);

    if (inputLength > 50)
    {
        nameFeedback.textContent = "*Name Lengths can't exceed 50 characters";
        inputElement.classList.add('invalid-regex');
        return false;
    } else 
    {
        nameFeedback.textContent = "";
        inputElement.classList.remove('invalid-regex');
        return true;
    }
}

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
                contactsContainer.innerHTML = `
                    <div class="card text-center">
                        <div class="card-body pb-1">
                            <p class="text-center">Could not fetch contacts...</p>
                        </div>
                    </div>
                `;
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
        <div class="table-responsive">
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
                    <button class="btn btn-sm btn-outline-primary edit-contact" style="margin-right: 5px" data-id="${contact.ID}">✎</button>
                    <button class="btn btn-sm btn-outline-danger delete-contact" data-id="${contact.ID}">🗑</button>
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

    // Retrieve values from the input fields + userId
    let nameInput = document.getElementById("nameInputAdd");
    let phoneInput = document.getElementById("phoneInputAdd");
    let emailInput = document.getElementById("emailInputAdd");
    let userId = getCookie("userId");

    let isNameValid = validateName(nameInput, 'nameFeedbackAdd');
    let isPhoneValid = validatePhone(phoneInput, 'phoneFeedbackAdd');
    let isEmailValid = validateEmail(emailInput, 'emailFeedbackAdd');

    if (!isNameValid || !isPhoneValid || !isEmailValid)
    {
        alert("Please make sure that all entries are in valid forms.");
        return;
    }

    if (!nameInput.value || !phoneInput.value || !emailInput.value)
    {
        alert("Please fill in all fields");
        return;
    }

    // Prepare the payload with the new contact information
    let tmp = { Name: nameInput.value, Phone: phoneInput.value, Email: emailInput.value, UserId: userId };
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
    document.getElementById('editNameInput').value = name;
    document.getElementById('editPhoneInput').value = phone;
    document.getElementById('editEmailInput').value = email;

    document.getElementById("editNameInput").classList.remove('invalid-regex');
    document.getElementById("editPhoneInput").classList.remove('invalid-regex');
    document.getElementById("editEmailInput").classList.remove('invalid-regex');
    document.getElementById("nameFeedbackEdit").textContent = "";
    document.getElementById("emailFeedbackEdit").textContent = "";
    document.getElementById("phoneFeedbackEdit").textContent = "";

    var editContactModal = new bootstrap.Modal(document.getElementById('editContactModal'));
    editContactModal.show();
}

function saveEditContact()
{
    let contactId = document.getElementById('editContactId').value;
    let nameInput = document.getElementById('editNameInput');
    let phoneInput = document.getElementById('editPhoneInput');
    let emailInput = document.getElementById('editEmailInput');
    let userId = getCookie("userId");

    let isNameValid = validateName(nameInput, 'nameFeedbackEdit');
    let isPhoneValid = validatePhone(phoneInput, 'phoneFeedbackEdit');
    let isEmailValid = validateEmail(emailInput, 'emailFeedbackEdit');

    if (!isNameValid || !isPhoneValid || !isEmailValid)
    {
        alert("Please format the data as instructed.");
        return;
    }

    if (!nameInput.value || !phoneInput.value || !emailInput.value)
    {
        alert("Please fill in all fields.");
        return;
    }

    let tmp = { ID: contactId, Name: nameInput.value, Phone: phoneInput.value, Email: emailInput.value };
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
                    contactsContainer.innerHTML = `
                    <div class="card text-center">
                        <div class="card-body pb-1">
                            <p class="text-center">No contacts found!</p>
                        </div>
                    </div>
                `;
                } else {
                    displayContacts(response.results);
                }
            } else {
                contactsContainer.innerHTML = `
                    <div class="card text-center">
                        <div class="card-body pb-1">
                            <p class="text-center">Could not fetch contacts!</p>
                        </div>
                    </div>
                `;
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
