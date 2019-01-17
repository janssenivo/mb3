// Simple script to terminate EC2 instances to simulate fail-over triggers
// Ivo Janssen <jansseni@amazon.com> for MasterBuilder III
const AWS = require('aws-sdk');
const inquirer = require('inquirer');
let region='';
let hosts = [];
let thishost = {};

// unset any environment variable just in case
process.env.AWS_REGION='';

// PICK REGION
var regionprompt = inquirer.createPromptModule();
var questions = [{
    type:'list',
    message:'Select AWS region:',
    name:'region',
    choices:['us-east-1','us-east-2','us-west-1','us-west-2']
}];
regionprompt(questions).then(answer => {
    console.log("Getting ec2 instances and databases for region "+answer.region);
    region=answer.region;

// RETRIEVE LIST OF RUNNING EC2 AND RDS INSTANCES
// TODO: query by "master builder" tag or something 
    return new AWS.EC2({region:region}).describeInstances().promise();
}).then(data => {
    data.Reservations.forEach(r => {
        r.Instances.forEach(i => {
            let name = ""; i.Tags.forEach((t) => {if (t.Key === "Name") name = t.Value});
            let state = i.State.Name;
            let InstanceId = i.InstanceId;
            let az = i.Placement.AvailabilityZone;
            hosts.push({value:InstanceId, type:"ec2", name:"ec2: "+name+" ("+InstanceId+", "+state+", "+az+")"});
        })
    });

    return new AWS.RDS({region:region}).describeDBInstances().promise();
}).then(data => {
    data.DBInstances.forEach(d => {
        let DBInstanceID = d.DBInstanceIdentifier;
        let az = d.AvailabilityZone;
        let endpoint = d.Endpoint.Address;
        let type = "rds";
        hosts.push({value:DBInstanceID, type:"rds", endpoint: endpoint, name:"rds: "+DBInstanceID+" ("+az+")"});
    })

// PROMPT WHICH INSTANCE TO TERMINATE
    var prompt = inquirer.createPromptModule();
    var questions = [{
        type:'list',
        message:'Select instance to terminate:',
        name:'id',
        choices:hosts
    }];
    return prompt(questions);
}).then(answer => {
    thishost = hosts.find(e => {return e.value === answer.id})

// TERMINATE OR FAILOVER SELECTED INSTANCE
    if(thishost.type === "ec2") {
        console.log("Terminating instance "+ thishost.name);
        let params = { InstanceIds: [ thishost.value]};
        return new AWS.EC2({region:region}).terminateInstances(params).promise();
    } else if (thishost.type === "rds") {
        console.log("Rebooting with failover rds instance "+ thishost.name);
        let params = { DBInstanceIdentifier: thishost.value, ForceFailover: true}
        return new AWS.RDS({region:region}).rebootDBInstance(params).promise();
    }
}).then(data => {
    //console.log("Result:", JSON.stringify(data));
    if (thishost.type === "rds") {
        console.log("to follow fail-over, run this command:");
        console.log("while true; do host "+thishost.endpoint+";sleep 1;done");
    }
},(err) => {
    console.log("ERROR! ",err);
});