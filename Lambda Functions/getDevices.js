'use strict'
const https = require('https');
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

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
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(null, { "statusCode": 400, "body": JSON.stringify(err.message) });
        }
    }).promise();
    console.log("Returned user: ", user);

    console.log("Attempting login");

    var postData = JSON.stringify({
        'email': user.Items[0].hub_email,
        'password': user.Items[0].hub_password
    });

    var options = {
        host: user.Items[0].hub_url,
        path: '/login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const token = await getLoginToken(options, postData);
    console.log("token acquired", token);

    let options1 = {
        host: user.Items[0].hub_url,
        path: '/things/',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token.jwt
        }
    };
    console.log("Getting devices");

    const devices = await getDevices(options1);
    console.log("Devices returned:", devices);
    callback(null, { "statusCode": 200, "body": JSON.stringify(devices) });


    function getLoginToken(options, postData) {
        return new Promise(((resolve, reject) => {

            const req = https.request(options, function (res) {
                console.log('STATUS for token: ' + res.statusCode);
                res.setEncoding('utf8');
                let dataString = '';

                res.on('data', chunk => {
                    dataString += chunk;
                });
                res.on('end', () => {
                    console.log("DONE Token :" + dataString);
                    resolve(JSON.parse((dataString)));
                });

            });

            req.on('error', (e) => {
                console.error(e);
            });

            req.write(postData)
            req.end();

        }));
    }

    function getDevices(options) {
        return new Promise(((resolve, reject) => {

            const req = https.get(options, function (res) {
                console.log('STATUS for Devices: ' + res.statusCode);
                res.setEncoding('utf8');
                let dataString = '';

                res.on('data', chunk => {
                    dataString += chunk;
                });
                res.on('end', () => {
                    console.log("DONE");
                    resolve(JSON.parse((dataString)));
                });

            });

            req.on('error', (e) => {
                console.error(e);
            });

            req.end();

        }));
    }
}


