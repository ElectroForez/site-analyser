# url-analyzer

# install
`npm i`
# run

````
$ npm start

> url analyser@1.0.0 start
> node src/server.js

Server running on http://localhost:3000

````

# example of usage

````
curl --location --request POST 'http://localhost:3000/urlAnalyse' \
--header 'Content-Type: application/json' \
--data-raw '{
    "urls": ["http://yandex.ru", "http://habrahabr.ru"],
    "ignoreRegisters": true,
    "wordsCount": 3,
    "minWordLen": 5
}' \
--output result.pdf
````

# Swagger
http://localhost:3000/documentation