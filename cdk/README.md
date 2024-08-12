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
ssh-keygen -t rsa -b 4096 -f my-github-actions-key-siren-smoothies -C "github-actions"

# create the key pair in aws
aws ec2 import-key-pair --key-name "my-github-actions-key-siren-smoothies" --public-key-material fileb://my-github-actions-key-siren-smoothies.pub

# Make sure to save your new keypair public and private values, we have to add the private key to a github actions secret for deployments
# Create Github Action Secret "SSH_PRIVATE_KEY" with the private generate key

# bootstrap the environment, only once
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

# Caveats
## Installing Certs for HTTPS/SSL Support
1. Change the DNS A record to point to new server IP address
2. In order for certbot to fetch and install a valid certificate into the NGINX instance, it must first validate that the 
domain name's DNS records contain an A record that points to the server from which the request is originating.
If it doesn't contain this A record at time of CDK deployment, you can manually connect to the EC2 instance and run:
```shell
certbot --nginx --non-interactive --agree-tos --email anna.c.harbour@gmail.com -d sirensmoothies.com -d www.sirensmoothies.com
```
If this command fails, it is most likely that the NGINX configuration does not have a server block containing server names
for the domains "sirensmoothies.com" and "www.sirensmoothies.com". Ensure this is resolved and run any remaining instructions
from the previous certbot CLI output.