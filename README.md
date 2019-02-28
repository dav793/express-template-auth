
# HTTP/WS Server application template
## Based on node.js and express.js

### Description
Basic http + web sockets server application supporting logging (using winston.js) and unit tests (using mocha/chai).

### Usage

* ```npm start``` compile to /dist and serve application + watch for source changes.

* ```npm test``` compile to /dist and run tests + watch for source changes.

* ```npm run test:once``` compile to /dist and run tests once.

* ```npm run serve``` serve application only (must be pre-compiled to /dist).

* ```npm run build``` compile to /dist

* ```npm run build:watch``` compile to /dist + watch for source changes

### DB Management
* Run MongoDB server without authorization
```mongod```

* Run MongoDB server with authorization
```mongod --auth```

* Create database
```mongo < scripts/createDatabase.js```

* Populate database
```mongo < scripts/populateDatabase.js```

* Clear database
```mongo < scripts/clearDatabase.js```

* Connect to mongo shell
```mongo mongodb://express-example-root:1234@localhost:27017/express-example```
