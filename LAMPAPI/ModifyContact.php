<?php
    $inData = getRequestInfo();

    $Name = $inData["Name"];
    $email = $inData["Email"];
    $phone = $inData["Phone"];
    $id = $inData["ID"];
    
    $conn = new mysqli("localhost", "TheBeast", "Group3Rules", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts Set Name=?, Phone=?, Email=? where ID=?");
        $stmt->bind_param("sssi", $Name, $phone, $email, $id);
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