var AWS = require('aws-sdk');
var express = require('express');
var app = express();

// Set the region
AWS.config.update({ region: 'us-east-1' });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var queueURL = "https://sqs.us-east-1.amazonaws.com/523357455489/TesteFila";

var params = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ["All"],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 20 // Aumente o WaitTimeSeconds para diminuir a frequência de consultas
};

function receiveAndProcessMessages() {
  sqs.receiveMessage(params, function (err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function (err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data);
        }
      });
    }
    // Chama a função novamente após o processamento ou espera por mais mensagens
    receiveAndProcessMessages();
  });
}

// Inicia o processo de recebimento de mensagens
receiveAndProcessMessages();

app.listen(3007, () => {
  console.log("http://localhost:3007");
});
