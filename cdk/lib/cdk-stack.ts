import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class Ec2Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // VPC
        const vpc = new ec2.Vpc(this, 'MyVpc', {
            maxAzs: 2, // Use all available AZs in the region
        });

        // Security Group for EC2 Instance
        const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
            vpc,
            description: 'Allow HTTP, HTTPS, and SSH access',
            allowAllOutbound: true,
        });

        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS');
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');

        // IAM Role for EC2 Instance
        const role = new iam.Role(this, 'InstanceRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
            ],
        });

        // User Data Script to Install Nginx and Node.js
        const userData = ec2.UserData.forLinux();
        userData.addCommands(
            // Update packages
            'yum update -y',
            // Install Nginx
            'amazon-linux-extras install nginx1 -y',
            'systemctl start nginx',
            'systemctl enable nginx',
            // Install Node.js 20
            'curl -sL https://rpm.nodesource.com/setup_20.x | bash -',
            'yum install -y nodejs'
        );

        const keyPair = ec2.KeyPair.fromKeyPairName(this, 'KeyPair', 'my-github-actions-key');


        // EC2 Instance with Elastic IP
        const instance = new ec2.Instance(this, 'MyInstance', {
            vpc,
            instanceType: new ec2.InstanceType('t3.micro'),
            machineImage: ec2.MachineImage.latestAmazonLinux2(), // Use Amazon Linux 2
            securityGroup,
            role,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            keyPair,
            userData,
            requireImdsv2: true
        });

        // Allocate an Elastic IP and associate it with the EC2 instance
        const eip = new ec2.CfnEIP(this, 'MyEIP', {
            instanceId: instance.instanceId,
        });

        // Route 53 Hosted Zone
        // const hostedZone = new route53.HostedZone(this, 'MyHostedZone', {
        //     zoneName: 'example.com', // Replace with your domain name
        // });

        // Create an A Record pointing to the Elastic IP
        // new route53.ARecord(this, 'MyARecord', {
        //     zone: hostedZone,
        //     target: route53.RecordTarget.fromIpAddresses(eip.ref),
        // });

        // Output the domain name and Elastic IP
        // new cdk.CfnOutput(this, 'DomainName', { value: `example.com` });
        new cdk.CfnOutput(this, 'ElasticIP', { value: eip.ref });
    }
}