# MB3

* Cloudformation template for sample LAMP stack on AWS
* Small node script to kill EC2 servers to demonstrate HA via Autoscaling

## Pre-requisites

* Create S3 bucket, copy the following files from "assets" to that bucket.
  * ```aws s3 cp assets s3://MYBUCKETNAME/ --recursive```
* Make ```style.css``` and ```octank.png``` public via the Console since they are static file references in the webpage
* Set S3 bucket name as "S3Source" in parameters file below
* Create keypair, ssl certificate, set them in parameters file below  
* This stack relies on access to an existing Route53 domain
* If you set "IsPrimary" to "yes", then the DNS RecordSet will be created as Failover/PRIMARY
* If you set "IsPrimary" to "no", then two things will happen:
  # the DNS RecordSet will be created as Failover/SECONDARY
  # the Database will be created from snapshot (defined in the parameters)
* The "Secondary" option is useful if you want to create this stack in a second region as a failover region. 

## Handy tips for automation

* Source this shell script for commands "crstack" etc.

  ```$ source stackbuilder.sh```

* Sample parameter file: ```cf-parameters.json```

```[
    { "ParameterKey": "EC2KeyName",   "ParameterValue": "mykeyname" },
    { "ParameterKey": "DomainName",   "ParameterValue": "mydomain.com" },
    { "ParameterKey": "S3Source",     "ParameterValue": "mys3bucket" },
    { "ParameterKey": "DoCloudFront", "ParameterValue": "no" },
    { "ParameterKey": "IsPrimary",    "ParameterValue": "yes" },
    { "ParameterKey": "DBSnapShot",   "ParameterValue": "my-snapshot-name" }
]
```
* At this time, the ACM Cert mappings for the various regions are hardcoded in the template. 
Please edit your arns directly in the .yaml file. TODO: Make this mapping a configurable parameter

* Use ```crstack``` to create a stack, ```upstack``` to update the stack, ```delstack``` to delete the stack
* Use ```describestack``` to get a running log (via ```watch```) of stack events
