# Handy commands for managing your stack.
# Please set AWS_REGION envvar before running these scripts.

export AWS_PROFILE=mb
MYSTACKNAME=mb3

describestack () {
    watch -n5 "echo $AWS_REGION; aws cloudformation describe-stack-resources \
    --stack-name $MYSTACKNAME --output table --region $AWS_REGION \
    --query 'StackResources[*].[LogicalResourceId,ResourceStatus,Timestamp]' | grep -v COMPLETE"
}

crstack () {
    echo $AWS_REGION
    aws cloudformation create-stack \
    --stack-name $MYSTACKNAME --output table --region $AWS_REGION \
    --template-body file://cf-ivo-mb2-building.yaml \
    --parameters file://cf-parameters.json \
    --capabilities CAPABILITY_NAMED_IAM &&
    describestack
}
upstack () {
    echo $AWS_REGION
    aws cloudformation update-stack \
    --stack-name $MYSTACKNAME --region $AWS_REGION \
    --template-body file://cf-ivo-mb2-building.yaml \
    --parameters file://cf-parameters.json \
    --capabilities CAPABILITY_NAMED_IAM &&
    describestack
}
delstack () {
    echo $AWS_REGION
    aws cloudformation delete-stack \
    --stack-name $MYSTACKNAME --region $AWS_REGION &&
    describestack
}
