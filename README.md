Welcome to the Serverless Application Model
==============================================

This sample code helps get you started with a simple web service integration hook deployed by AWS CloudFormation to AWS Lambda and Amazon Dynamo DB.

The Amazon Connect integration with Lambda is useful to execute a business logic during the contact flow to help interact with other AWS services or data sources.
In this example, lambda integration is used to fetch the customer details from a data source like Dynamo DB based on the contact number used to make a call to the 
IVR contact centre

Interaction model:
- Customer calls the IVR/Contact Centre Number
- Within the IVR Contact Flow, a Lambda function is invoked using the ARN using ‘Invoke AWS Lambda function’ action block
- Lambda function calls DynamoDB GET function to retrieve customer details and returns simple key value pairs
- Contact Flow can either use the retrieved information within the flow or save it to Contact Trace Record using ‘Set Contact Attributes’ action block

Pre-requisites:
- Create a instance of Amazon Connect and define a contact flow
- Set the permissions on Lambda function so that Connect Instance can invoke it using the template below
- Insert a row in Dynamo DB table with columns [minimum set: CalledNumber, FirstName, LastName, LastCallDate] and other attributes if needed

Lambda Function Invocation from IVR
Amazon Connect can successfully invoke a Lambda function in an AWS account when a resource policy has been set on the Lambda function. Use the AWS CLI command line tools 
as it to create a resource policy in the AWS Management Console. For more information, see Using Resource-Based Policies for AWS Lambda (Lambda Function Policies).
Requirements:
• The ARN of a Amazon Connect instance (for example, arn:aws:connect:useast-1:123456789012:instance/def1a4fc-ac9d-11e6-b582-example)
• The AWS account ID for the Lambda function (for example, 123456789012)
• The name of the Lambda function

Next, create a resource policy using this information. Use the following command:
aws lambda add-permission --function-name function:<my-lambda-function> \
--statement-id 1 --principal connect.amazonaws.com --action lambda:InvokeFunction \
--source-arn  arn:aws:connect:<AWS Region>:<account ID>:instance/<amazon connect instance ID> \
--source-account <account ID>

Request
When you invoke a Lambda function, the set of parameters passed can be seen in the model definition. The sample JSON request event is available on 
page#14 of the Amazon Connect Administration Guide. The request is divided into three parts:
• Contact data—This is always passed by Amazon Connect for every contact. Some parameters are optional.
• User attributes—These are attributes saved in a contact flow based on previous Set attributes blocks in the contact flow. 
  This map may be empty if there aren't any saved attributes.
• Parameters—These are parameters specific to this call.

Response
The Lambda function response should be a simple Map string string. This map can be up to 32k. 

Dynamo DB
On the Dynamo DB Web Console, please add a row with Called Number as unique key to enter the customer details which will be retrieved during the contact flow.
Attribute Keys: CalledNumber, FirstName, LastName and LastCallDate [Minimum set]

Kindly take note of the Attribute Key Names and the case used with no blanks.

AWS Serverless Application Model (AWS SAM)
The service allows you to easily create and manage resources used in your serverless application using AWS CloudFormation.
You can define your serverless application as a SAM template - a JSON or YAML configuration file that describes Lambda function, API endpoints and other resources
in your application. Using nifty commands, you upload this template to CloudFormation which creates all the individual resources and groups them into a CloudFormation
Stack for ease of management. When you update your SAM template, you will re-deploy the changes to this stack. AWS CloudFormation will take care of updating the
individual resources for you.
