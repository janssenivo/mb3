# MB3

* Cloudformation template for sample LAMP stack on AWS
* Small node script to kill EC2 servers to demonstrate HA via Autoscaling


## Handy tips for automation

* Source this shell script for commands "crstack" etc.

```source stackbuilder.sh```
* Sample parameter file:

```[
    { "ParameterKey": "EC2KeyName",         "ParameterValue": "mykeyname" },
    { "ParameterKey": "AvailabilityZones",  "ParameterValue": "us-east-1a,us-east-1b" },
    { "ParameterKey": "AlbAcmCertificate",  "ParameterValue": "arn:aws:acm:us-east-1:123:certificate/uuid" }
]
```
