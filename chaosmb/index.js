// Simple script to terminate EC2 instances to simulate fail-over triggers
// Ivo Janssen <jansseni@amazon.com> for MasterBuilder III
const AWS = require('aws-sdk');
const inquirer = require('inquirer');
let region='';
let hosts = [];

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
        let type = "rds";
        hosts.push({value:DBInstanceID, type:"rds", name:"rds: "+DBInstanceID+" ("+az+")"});
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
    let host = hosts.find(e => {return e.value === answer.id})

// TERMINATE OR FAILOVER SELECTED INSTANCE
    if(host.type === "ec2") {
        console.log("Terminating instance "+ host.name);
        let params = { InstanceIds: [ host.value]};
        return new AWS.EC2({region:region}).terminateInstances(params).promise();
    } else if (host.type === "rds") {
        console.log("Rebooting with failover rds instance "+ host.name);
        let params = { DBInstanceIdentifier: host.value, ForceFailover: true}
        return new AWS.RDS({region:region}).rebootDBInstance(params).promise();
    }
}).then(data => {
    //console.log("Result:", JSON.stringify(data));
    
},(err) => {
    console.log("ERROR! ",err);
});