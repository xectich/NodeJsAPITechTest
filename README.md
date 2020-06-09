# NodeJs Tech Test App

### Overview
This is part of a tech test and utilises the API from https://bpdts-test-app.herokuapp.com/ to return users who either live in London or within a 50 mile distance from the city.

## Running Locally

Setup
```
npm install
```
Run
```
node app.js
```

### Calling API
```
localhost:3000/users/London
```
Curl
```
curl -X GET "http://localhost:3000/users/London" -H "accept: application/json"
```

## Testing
Run
```
npm test
```