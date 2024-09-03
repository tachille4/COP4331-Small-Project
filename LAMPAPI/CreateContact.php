<?php
    $inData = getRequestInfo();

    $name = $inData["Name"];
    $phone = $inData["Phone"];
    $email = $inData["Email"];
    $userID = $inData["UserId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    // Add contact to the table
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (Name, Phone, Email, UserID) VALUES(?,?,?,?)");
        $stmt->bind_param("sssi", $name, $phone, $email, $userID);
        $stmt->execute();

        $id = $conn->insert_id;

        $stmt->close();
        $conn->close();

        http_response_code(200);
        returnWithInfo($id);
    }

    // Parse incoming JSON request
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    // Set the content header and return the JSON object
    function sendResultInfoAsJson( $obj ) 
    {
        header('Content-Type: application/json');
        echo $obj;
    }

    // Return the user ID and empty error as a JSON object
    function returnWithInfo( $id )
	{
		$retValue = json_encode(array("id" => $id, "error" => ""));
		sendResultInfoAsJson( $retValue );
	}

    // Return an error message
    function returnWithError( $err ) 
    {
        $retValue = json_encode(array("error" => $err));
        sendResultInfoAsJson( $retValue );
    }
?>