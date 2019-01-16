// Simple script to terminate EC2 instances to simulate fail-over triggers
// Ivo Janssen <jansseni@amazon.com> for MasterBuilder III
const AWS = require('aws-sdk');
const inquirer = require('inquirer');
let region='';

process.env.AWS_REGION='';

// PICK REGION
var regionprompt = inquirer.createPromptModule();
var questions = [{
    type:'list',
    message:'select AWS region',
    name:'region',
    choices:['us-east-1','us-east-2','us-west-1','us-west-2']
}];
regionprompt(questions).then(answer => {
    console.log("Getting instance list for region "+answer.region);
    region=answer.region;

// RETRIEVE LIST OF RUNNING INSTANCES
// TODO: query by "master builder" tag or something 
    return new AWS.EC2({region:region}).describeInstances().promise();
}).then(data => {
    let hosts = [];
    data.Reservations.forEach(r => {
        r.Instances.forEach(i => {
            //console.log (i);
            let name = ""; i.Tags.forEach((t) => {if (t.Key === "Name") name = t.Value});
            let state = i.State.Name;
            let InstanceId = i.InstanceId;
            hosts.push({value:InstanceId, name:name+"("+InstanceId+", "+state+")"});
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

// TERMINATE SELECTED INSTANCE
    let params = { InstanceIds: [ answer.InstanceId]};
    //console.log(params);
    return new AWS.EC2({region:region}).terminateInstances(params).promise();
}).then(data => {
    console.log(JSON.stringify(data));
    
},(err) => {
    console.log("ERROR! ",err);
});