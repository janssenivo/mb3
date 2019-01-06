// Simple script to terminate EC2 instances to simulate fail-over triggers
// Ivo Janssen <jansseni@amazon.com> for MasterBuilder III
const AWS = require('aws-sdk');
const inquirer = require('inquirer');

let hosts = [];


// RETRIEVE LIST OF RUNNING INSTANCES
// TODO: query by "master builder" tag or something 
let describeInstances = new AWS.EC2().describeInstances().promise();
describeInstances.then(data => {
    data.Reservations.forEach(r => {
        r.Instances.forEach(i => {
            let name = ""; i.Tags.forEach((t) => {if (t.Key === "Name") name = t.Value});
            let InstanceId = i.InstanceId;
            hosts.push({value:InstanceId, name:name+"("+InstanceId+")"});
            //console.log(instanceId,name);
        })
    });

// PROMPT WHICH INSTANCE TO TERMINATE
    var prompt = inquirer.createPromptModule();
    var questions = [{
        type:'list',
        message:'Select instance to terminate',
        name:'InstanceId',
        choices:hosts
    }];
    return prompt(questions);
}).then(answer => {
    //console.log(answer);

// TERMINATE SELECTION INSTANCE
    let params = { InstanceIds: [ answer.InstanceId]};
    //console.log(params);
    return new AWS.EC2().terminateInstances(params).promise();
}).then(data => {
    console.log(JSON.stringify(data));
    
},(err) => {
    console.log("ERROR! ",err);
});