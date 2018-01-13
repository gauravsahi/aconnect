Welcome to Amazon Connect Serverless Hook for Contextual Messages
=================================================================

The sample code helps get you started with a simple web service integration hook deployed by AWS CloudFormation between Amazon Connect and AWS Lambda with Dynamo DB.

The Amazon Connect integration with Lambda is useful to execute a business logic during the contact flow to help interact with other AWS services or data sources.
In this example, lambda integration is used to fetch the customer details from a data source like Dynamo DB based on the contact number used to make a call to the 
IVR contact centre

Interaction model:
- Customer calls the IVR/Contact Centre Number
- Within the IVR Contact Flow, a Lambda function is invoked using the ARN using ‘Invoke AWS Lambda function’ action block
- Lambda function calls DynamoDB GET function to retrieve customer details and returns simple key value pairs
- Contact Flow can either use the retrieved information within the flow or save it to Contact Trace Record using ‘Set Contact Attributes’ action block

Pre-requisites:
- AWS Account
- Amazon Connect Instance with a contact flow which uses ‘Invoke AWS Lambda Function’ action block
- AWS CLI if you prefer to deploy the package using command line with IAM permissions for Role creation, attachment and deletion for the user

How to deploy:
- Clone the Github repository to a chosen target folder on your local PC or Mac
- Execute the following command on command prompt / terminal after navigating to the target folder
    aws cloudformation deploy --template-file serverless-output.yaml --stack-name \<enter-stack-name\> --capabilities CAPABILITY_IAM parameter-overrides Connectarn\=\<amazon-connect-instance-arn\>
  OR
- Open AWS Web Console for Cloud Formation, click on Create Stack and select the Serverless.yml, enter stack name and provide Amazon Connect Instance ARN to deploy the package

Lambda Functions:
In this example, Cloud Formation template creates a stack with 2 lambda functions
- HelloWorld with naming schema like ‘<stack>-HelloWorld-<random Alpha key>’ is the main function which does data dip and returns key value pairs to Amazon Connect
- InitFunction with naming schema like ‘<stack>-InitFunction-<random Alpha key>’ is only a initialisation function to pre-populate the Dynamo DB table

Lambda Function Invocation from IVR:
Amazon Connect can successfully invoke a Lambda function in an AWS account when a resource policy has been set on the Lambda function. It is done using the AWS CLI command line tools 
to create a resource policy which can be viewed in the AWS Management Console. For more information, see Using Resource-Based Policies for AWS Lambda (Lambda Function Policies).
Structure:
• The ARN of a Amazon Connect instance (for example, arn:aws:connect:useast-1:123456789012:instance/def1a4fc-ac9d-11e6-b582-example)
• The AWS account ID for the Lambda function (for example, 123456789012)
• The name of the Lambda function
In this example, Cloud Formation will create the Invoke Permission for the Lambda Function as part of the stack creation

Request:
Note down the Lambda function ARN given in the key ‘LambdaFnARN’ from Outputs tab of Cloud Formation Web Console. You need to use the value for invoking the 
function from Amazon Connect Instance contact flow. When you invoke a Lambda function, the set of parameters passed can be seen in the model definition. 
The sample JSON request event is available on page#14 of the Amazon Connect Administration Guide. The request is divided into three parts:
• Contact data—This is always passed by Amazon Connect for every contact. Some parameters are optional.
• User attributes—These are attributes saved in a contact flow based on previous Set attributes blocks in the contact flow. 
  This map may be empty if there aren't any saved attributes.
• Parameters—These are parameters specific to this call.

Response:
The Lambda function response should be a simple Map string string. This map can be up to 32k.
In this example, the lambda function will return 4 values CalledNumber, FirstName, LastName and LastCalledDate

Dynamo DB:
In this example, CloudFormation will deploy a DynamoDB table with name 'AConnect-CC' with unique primary attribute key name 'CalledNumber'. The Cloud formation template uses a custom resource (InitFunction with naming schema like ‘<stack>-InitFunction-<random Alpha key>’) to pre-populate the Dynamo DB table (AConnect-CC) with a sample entry which will be retrieved & used in the contact flow.
Attribute Keys: CalledNumber, FirstName, LastName and LastCallDate [Minimum set]
Attribute Key Values (example): 101, James, Bond, <Today’s Date>

AWS Serverless Application Model (AWS SAM):
The service allows you to easily create and manage resources used in your serverless application using AWS CloudFormation.
You can define your serverless application as a SAM template - a JSON or YAML configuration file that describes Lambda function, API endpoints and other resources
in your application. Using nifty commands, you upload this template to CloudFormation which creates all the individual resources and groups them into a CloudFormation
Stack for ease of management. When you update your SAM template, you will re-deploy the changes to this stack. AWS CloudFormation will take care of updating the
individual resources for you.
