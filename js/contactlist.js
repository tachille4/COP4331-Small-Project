const urlBase = 'http://157.245.90.244/LAMPAPI';
const extension = 'php';

let contactText = document.getElementById("contactText");

function addContact()
{
	let name = document.getElementById("nameTextAdd").value;
    let phone = document.getElementById("phoneTextAdd").value;
    let email = document.getElementById("emailTextAdd").value;
    let userId = document.getElementById("useridTextAdd").value;
	document.getElementById("contactAddResult").innerHTML = "";


	let tmp = {Name:name,Phone:phone,Email:email,UserId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/CreateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function editContact()
{
    let name = document.getElementById("nameTextEdit").value;
    let phone = document.getElementById("phoneTextEdit").value;
    let email = document.getElementById("emailTextEdit").value;
    let userId = document.getElementById("useridTextEdit").value;
	document.getElementById("contactEditResult").innerHTML = "";

    let tmp = {Name:name,Phone:phone,Email:email,UserId:userId};
	let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/ModifyContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactEditResult").innerHTML = "Contact has been modified.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchContact()
{
	let srchName = document.getElementById("nameSearchText").value;
    let srchUserid = document.getElementById("useridSearchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srchName,userId:srchUserid};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved.";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				contactText.innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}
