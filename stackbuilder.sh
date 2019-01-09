export AWS_PROFILE=mb

crstack () {
     aws cloudformation create-stack \
     --profile mb --stack-name myteststack \
     --template-body file://cf-ivo-mb2-building.yaml \
     --parameters file://ivo-mb-parameters.json \
     --capabilities CAPABILITY_NAMED_IAM
}
upstack () {
     aws cloudformation update-stack \
     --profile mb --stack-name myteststack \
     --template-body file://cf-ivo-mb2-building.yaml \
     --parameters file://ivo-mb-parameters.json \
     --capabilities CAPABILITY_NAMED_IAM
}
delstack () {
    aws cloudformation delete-stack \
    --profile mb --stack-name myteststack
}
