<?php
    $conn = new mysqli("localhost", "TheBeast", "Group3Rules", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        # Endpoint execution here
    }

    function sendResultInfoAsJson( $obj ) 
    {
        header('Content-type: application/json');
        echo $obj;
    }
    function returnWithError( $err ) 
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
?>