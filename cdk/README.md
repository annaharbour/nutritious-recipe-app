# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


```shell

# have to generate the key pair for the ec2 instance locally first time
ssh-keygen -t rsa -b 4096 -f my-github-actions-key -C "github-actions"

# create the key pair in aws
aws ec2 import-key-pair --key-name "my-github-actions-key" --public-key-material fileb://my-github-actions-key.pub

# Make sure to save your new keypair public and private values, we have to add the private key to a github actions secret for deployments
# Create Github Action Secret "SSH_PRIVATE_KEY" with the private generate key

# bootstrap the environment
cdk bootstrap

# deploy the stack
cdk deploy

# Create Github Action Secret "EC2_PUBLIC_IP" with output from 'cdk deploy'
```

Helpful commands when connecting to the instance over SSH
```shell

# Become root user
sudo -i
```


```json
{
    "KeyFingerprint": "86:6f:57:15:4e:66:4f:36:fd:46:92:1c:46:2d:7d:d9",
    "KeyName": "my-github-actions-key",
    "KeyPairId": "key-077c2fd31ba75ee2f"
}
```