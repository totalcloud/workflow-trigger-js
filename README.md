# workflow-trigger-js
Trigger totalcloud workflows programatically

## Requirements
1. Nodejs
2. totalcloud account

## Installation
```shell script
# install npm modules
npm install
# create .env file from example 
```

## Generating token for postman
```shell script
node token.js 'username' 'password' > token.txt
```

## Trigger Workflow
```shell script
node index.js 'username' 'password' 'trigger_url'
```

## Expiry
Tokens expire after 60 minutes