export AWS_PROFILE=mb

MYSTACKNAME=mb3

describestack () {
    watch -n5 aws cloudformation describe-stack-events \
    --stack-name $MYSTACKNAME --output table \
    --query 'StackEvents[*].[LogicalResourceId,ResourceStatus,Timestamp]'
}

crstack () {
    aws cloudformation create-stack \
    --stack-name $MYSTACKNAME --output table \
    --template-body file://cf-ivo-mb2-building.yaml \
    --parameters file://cf-parameters.json \
    --capabilities CAPABILITY_NAMED_IAM
}
upstack () {
    aws cloudformation update-stack \
    --stack-name $MYSTACKNAME \
    --template-body file://cf-ivo-mb2-building.yaml \
    --parameters file://cf-parameters.json \
    --capabilities CAPABILITY_NAMED_IAM
}
delstack () {
    aws cloudformation delete-stack \
    --stack-name $MYSTACKNAME
}
