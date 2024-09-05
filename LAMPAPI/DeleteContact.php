<?php
    $inData = getRequestInfo();

    // Check if UserID and Name are set and not null
    if (!isset($inData["UserID"]) || !isset($inData["Name"])) {
        http_response_code(500);
        returnWithError("Missing required fields: UserID or Name");
        exit();
    }

    $userId = $inData["UserID"];
    $name = $inData["Name"]; 

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    // Delete contact enrty under the name and user ID
    else
    {
        $stmt = $conn->prepare("DELETE from Contacts where Name=? AND UserID=?");
        $stmt->bind_param("si", $name, $userId);
        $stmt->execute();

        $stmt->close();
        $conn->close();

        http_response_code(200);
        returnWithError("");
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

    // Return an error message
    function returnWithError( $err ) 
    {
        $retValue = json_encode(array("error" => $err));
        sendResultInfoAsJson( $retValue );
    }
?>