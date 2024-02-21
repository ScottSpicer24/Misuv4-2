'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
    var response;

    // Identify the user making the request
    var params = {
        TableName: "User",
        KeyConditionExpression: "#id = :userid",
        ExpressionAttributeNames: {
            "#id": "user_id"
        },
        ExpressionAttributeValues: {
            ":userid": event.requestContext.authorizer.claims.sub
        }
    };
    const user = await documentClient.query(params, function (err, data) {
        if (err) {
            console.log("Unable to query the requesting user in the user table, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Error occured while looking up your information"
                })
            };
            return response;
        }
    }).promise();
    // console.log("User in Request: %j", user);

    // Find out who we are sharing to
    var logParams = {
        TableName: "Credentials_Log",
        IndexName: "secondary_user_id-index",
        KeyConditionExpression: "#id = :value",
        ExpressionAttributeNames: {
            "#id": "secondary_user_id"
        },
        ExpressionAttributeValues: {
            ":value": user.Items[0].user_id
        }
    };
    const logs = await documentClient.query(logParams, function (err, data) {
        if (err) {
            console.log("Unable to query the credentials_log, error:", JSON.stringify(err, null, 2));
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    statusCode: 400,
                    message: "Error occured while searching for your logs"
                })
            };
            return response;
        }
    }).promise();
    // console.log("Logs: %j", logs);

    // console.log("Combining logs into var results...");
    var results = [];
    var primary = {};
    for (var i = 0; i < logs.Items.length; i++) {
        // Check if we already know who the user is before querying the table again
        if (primary.user_id !== logs.Items[i].primary_user_id) {
            // Find out who created the access log for this user
            var primaryParams = {
                TableName: "User",
                KeyConditionExpression: "#id = :userid",
                ExpressionAttributeNames: {
                    "#id": "user_id"
                },
                ExpressionAttributeValues: {
                    ":userid": logs.Items[i].primary_user_id
                }
            };
            const primaryUser = await documentClient.query(primaryParams, function (err, data) {
                if (err) {
                    console.log("Unable to query the user table for the primary user, error:", JSON.stringify(err, null, 2));
                    response = {
                        statusCode: 200,
                        body: JSON.stringify({
                            statusCode: 400,
                            message: "Couldn't find the user who shared to you"
                        })
                    };
                    return response;
                }
            }).promise();
            primary = primaryUser.Items[0];
        }

        // console.log(logs.Items[i].credentials_log_id);
        var log = {};
        log.primary_user = primary.name;
        log.time = logs.Items[i].time;
        log.date = logs.Items[i].date;
        log.operation = logs.Items[i].operation;

        results.push(log);
    }

    response = {
        statusCode: 200,
        body: JSON.stringify({
            statusCode: 200,
            message: results
        })
    };
    return response;
};