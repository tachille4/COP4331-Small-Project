<?php
    $inData = getRequestInfo();

    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $login = $inData["Login"];
    $password = $inData["Password"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // No duplicate users
        $stmt = $conn->prepare("SELECT * from Users where Login = ?");
        $stmt->bind_param("s", $login);
        $stmt->execute();

        $result = $stmt->get_result();

        // No dupelicate login found
        // Insert the user and an ID, then return the ID as a JSON object
        if($result->num_rows == 0)
        {
            $stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
            
            $id = $conn->insert_id;
    
            $stmt->close();
            $conn->close();
    
            http_response_code(200);
            returnWithInfo($id);
        }
        // Else login already exists, return an error
        else
        {
            http_response_code(409);
            returnWithError( "Username already exists" );
        }
    }

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson( $obj ) 
    {
        header('Content-Type: application/json');
        echo $obj;
    }

    function returnWithInfo( $id )
	{
		$retValue = json_encode(array("id" => $id, "error" => ""));
		sendResultInfoAsJson( $retValue );
	}

    function returnWithError( $err ) 
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>