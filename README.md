# MB3

* Cloudformation template for sample LAMP stack on AWS
* Small node script to kill EC2 servers to demonstrate HA via Autoscaling

## Pre-requisites

* Create S3 bucket, copy the following files from "assets" to that bucket.
  * ```aws s3 cp assets s3://MYBUCKETNAME/ --recursive```
* Make ```style.css``` and ```octank.png``` public via the Console since they are static file references in the webpage
* Set S3 bucket name as "S3Source" in parameters file below
* Create keypair, ssl certificate, set them in parameters file below  

## Handy tips for automation

* Source this shell script for commands "crstack" etc.

  ```$ source stackbuilder.sh```

* Sample parameter file: ```cf-parameters.json```

```[
    { "ParameterKey": "EC2KeyName",         "ParameterValue": "mykeyname" },
    { "ParameterKey": "AvailabilityZones",  "ParameterValue": "us-east-1a,us-east-1b" },
    { "ParameterKey": "DomainName",         "ParameterValue": "example.com" },
    { "ParameterKey": "S3Source",           "ParameterValue": "mybucketname" },
    { "ParameterKey": "AlbAcmCertificate",  "ParameterValue": "arn:aws:acm:us-east-1:123:certificate/uuid" }
]
```

* Use ```crstack``` to create a stack, ``upstack``` to update the stack, ```delstack``` to delete the stack
* Use ```describestack``` to get a running log (via ```watch```) of stack events
