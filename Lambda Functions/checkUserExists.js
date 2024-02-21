'use strict';
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  const body = JSON.parse(event.body);
  var response;

  const params =
  {
    TableName: "User",
    IndexName: "email-index",
    KeyConditionExpression: "#email = :input",
    ExpressionAttributeNames: {
      "#email": "email"
    },
    ExpressionAttributeValues: {
      ":input": body.email
    }
  };

  try {
    const user = await documentClient.query(params).promise();
    if (user.Count == 0) {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: 200,
          message: 0
        })
      };
      return response;
    }
    else {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          statusCode: 200,
          message: 1
        })
      };
      return response;
    }
  } catch (err) {
    console.log("Error occured while checking if the user exists: " + err);
    response = {
      statusCode: 400,
      body: JSON.stringify({
        statusCode: 400,
        message: "Error occured while checking if the user exists"
      })
    };
    return response;
  }
};