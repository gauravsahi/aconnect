'use strict';
 
// Simple Lambda function which is triggered from Amazon Connect Contact Flow to retrieve the user data from Dynamo DB using a Get function
// Details are First Name, Last Name and Last Call Date based on the called number fetched from the Event received
 
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
 
exports.handler = (event, context, callback) => {
    var firstname = " ";
    var lastname = " ";
    var lastcalldate = " ";
    var tablename = process.env['tablename'];

    var callednumber = event.Details.ContactData.CustomerEndpoint.Address;
    // parameter fetched from the JSON event recieved from Amazon Connect

    console.log('Received Event from Amazon Connect:', JSON.stringify(event));
 
    var params = {
        TableName : tablename, // Dynamo DB Table name with user data
        Key : {
            //CalledNumber: callednumber, // Key name used for querying
            CalledNumber: "101", //based on the sample entry made in the Dynamo DB Table
        },
    }
 
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log('some db error: '+err)
            context.done('error','getting item from dynamodb failed: '+err);
        }
        else {
            console.log('Values Retreived from data dip: '+ JSON.stringify(data, null, '  '));
            firstname = data.Item.FirstName;
            lastname = data.Item.LastName;
            lastcalldate = data.Item.LastCallDate;
 
            callback(null, {FirstName: firstname, LastName: lastname, LastCallDate: lastcalldate});
            // callback are simple key value pairs which can be used in contact flow and also saved in CTR using Set Contact Attributes (External)

            context.done('K THX BY');
        }
    });
};
