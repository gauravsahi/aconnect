'use strict';

console.log('Loading event');

var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = function(event, context) {

    console.log(JSON.stringify(event, null, '  '));

    // For Delete requests, immediately send a SUCCESS response.
    if (event.RequestType == "Delete") {
        sendResponse(event, context, "SUCCESS");
        return;
    }

    var responseStatus = "FAILED";

    var tableName = event.ResourceProperties.DynamoTableName;
    var datetime = new Date().getTime().toString();

    console.log("Table name received in event:" +tableName);

    dynamodb.putItem({
        "TableName": tableName,
        "Item" : {
            CalledNumber: {"S" : "101"},
            FirstName: {"S" : "James"},
            LastName: {"S" : "Bond"},
            LastCallDate: {"S" : datetime}
       }
    }, function(err, data) {
        if (err) {
          console.log('error occurred');
          //context.done("Error Occured");
        }
        else {
            console.log('great success');
            responseStatus = "SUCCESS";
        }
        sendResponse(event, context, responseStatus);
    });

};

// Send response to the pre-signed S3 URL
function sendResponse(event, context, responseStatus, responseData) {

    var responseBody = JSON.stringify({
        Status: responseStatus,
        Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
        PhysicalResourceId: context.logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: responseData
    });

    console.log("RESPONSE BODY:\n", responseBody);

    var https = require("https");
    var url = require("url");

    var parsedUrl = url.parse(event.ResponseURL);
    var options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: "PUT",
        headers: {
            "content-type": "",
            "content-length": responseBody.length
        }
    };

    console.log("SENDING RESPONSE...\n");

    var request = https.request(options, function(response) {
        console.log("STATUS: " + response.statusCode);
        console.log("HEADERS: " + JSON.stringify(response.headers));
        // Tell AWS Lambda that the function execution is done
        context.done();
    });

    request.on("error", function(error) {
        console.log("sendResponse Error:" + error);
        // Tell AWS Lambda that the function execution is done
        context.done();
    });

    // write data to request body
    request.write(responseBody);
    request.end();
}
