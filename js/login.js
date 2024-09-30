const urlBase = 'http://group3cop4331.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
    // Retrieve login credentials
	let login = document.getElementById("usernameInput").value;
	let password = document.getElementById("passwordInput").value;
    //	var hash = md5( password );

	console.log("Attempted to login with username: ", login);
	console.log("Attempted to login with password: ", password);
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
    //	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult")
					loginResult.innerHTML = "&#9888; Invalid login credentials.";

					// Clear fields
					document.getElementById("usernameInput").value = "";
					document.getElementById("passwordInput").value = "";

					return;
				}
				else
				{
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;

					saveCookie();

					window.location.href = "contactsPage.html";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister()
{
    let firstName = document.getElementById("firstNameInput").value;
    let lastName = document.getElementById("lastNameInput").value;
    let login = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

	// reset previous error message?
	document.getElementById("registerResult").innerHTML = "";

	if (password !== confirmPassword)
	{
		
		registerResult.classList.add('error-msg');
		document.getElementById("registerResult").innerHTML = "&#9888; Passwords do not match!";

		setTimeout(() =>
			{
				document.getElementById("registerResult").innerHTML = "";
				registerResult.classList.remove('error-msg');
			}, 3000);
		return;
	}

	let tmp = {FirstName:firstName,LastName:lastName,Login:login,Password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/CreateUser.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4) 
			{
				let jsonObject = JSON.parse( xhr.responseText );

				if (this.status == 200)
				{
					document.getElementById("registerResult")
					registerResult.classList.add('success-msg');
					registerResult.innerHTML = "&#x2714; Account created successfully. Please log in.";

				}
				else if (this.status == 409)
				{
					document.getElementById("registerResult")
					registerResult.classList.add('error-msg');
					registerResult.innerHTML = "&#9888; Username unavailable.";
				}
				else
				{
					document.getElementById("registerResult")
					registerResult.classList.add('error-msg');
					registerResult.innerHTML = "An unknown error occurred.";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
	finally
	{
		// Clear fields
		document.getElementById("firstNameInput").value = "";
		document.getElementById("lastNameInput").value = "";
		document.getElementById("registerUsername").value = "";
		document.getElementById("registerPassword").value = "";
		document.getElementById("confirmPassword").value = "";
	}
}

// Event listener for register submit button
document.getElementById("registerForm").addEventListener("submit", function(event)
{
    event.preventDefault();
    doRegister();
});

// Event listener for login submit button
document.getElementById("loginForm").addEventListener("submit", function(event)
{
    event.preventDefault();
    doLogin();
});

// Check that all HTML content has loaded
document.addEventListener('DOMContentLoaded', function ()
{
    let loginCard = document.getElementById('loginForm').parentElement.parentElement;
    let registerCard = document.getElementById('registerForm').parentElement.parentElement;

    let registerPrompt = document.getElementById('registerPrompt');
    let loginPrompt = document.getElementById('loginPrompt');

    // Switch to register card when register link is clicked
    document.getElementById("showRegisterCard").addEventListener('click', function ()
	{
        // Clear login fields
		document.getElementById("usernameInput").value = "";
		document.getElementById("passwordInput").value = "";
		loginResult.innerHTML = "";
		
		loginCard.classList.remove('show'); // Prepare login card for fade out
        loginCard.classList.add('fade-out'); // Fade out login card

        registerPrompt.classList.remove('show'); // Prepare register prompt for fade out
        registerPrompt.classList.add('fade-out'); // Fade out register prompt

		// Wait 200ms
        setTimeout(() =>
		{
            loginCard.classList.add('hidden'); // Hide login card
            loginCard.classList.remove('fade-out'); // Reset login card animation

			registerPrompt.classList.add('hidden'); // Hide register prompt
            registerPrompt.classList.remove('fade-out'); // Reset register prompt animation

            registerCard.classList.remove('hidden'); // Prepare register card for fade in
            registerCard.classList.add('fade-in'); // Fade in register card
			
			// Wait 200ms
            setTimeout(() =>
			{
                registerCard.classList.add('show'); // Show register card
                registerCard.classList.remove('fade-in'); // Reset register card animation

            	loginPrompt.classList.add('show'); // Show login prompt
            	loginPrompt.classList.remove('fade-in'); // Reset login prompt animation
            }, 200);

        }, 200);
		
    });

    // Switch back to login card when login link is clicked
    document.getElementById("showLoginCard").addEventListener('click', function ()
	{
        // Clear registration fields
		document.getElementById("firstNameInput").value = "";
		document.getElementById("lastNameInput").value = "";
		document.getElementById("registerUsername").value = "";
		document.getElementById("registerPassword").value = "";
		document.getElementById("confirmPassword").value = "";
		registerResult.innerHTML = "";
		
		registerCard.classList.remove('show'); // Prepare register card for fade out
        registerCard.classList.add('fade-out'); // Fade out register card

        loginPrompt.classList.remove('show'); // Prepare login prompt for fade out
        loginPrompt.classList.add('fade-out'); // Fade out login prompt

		// Wait 200ms
        setTimeout(() =>
		{
            registerCard.classList.add('hidden'); // Hide register card
            registerCard.classList.remove('fade-out'); // Reset register card animation

            loginPrompt.classList.add('hidden'); // Hide login prompt
            loginPrompt.classList.remove('fade-out'); // Reset login prompt animation

            loginCard.classList.remove('hidden'); // Prepare login card for fade in
            loginCard.classList.add('fade-in'); // Fade in login card

			// Wait 200ms
            setTimeout(() =>
			{
                loginCard.classList.add('show'); // Show login card
                loginCard.classList.remove('fade-in'); // Reset login card animation

                registerPrompt.classList.remove('hidden'); // Show register prompt
                registerPrompt.classList.add('show'); // Reset register prompt animation
            }, 200);

        }, 200);
    });
});

function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));    
    document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "lastName=" + lastName + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
    
    console.log("Cookies set:", document.cookie);
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
