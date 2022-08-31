# url-analyzer

Первое отборочное задание для стажировки в Lad

Анализ текста на сайтах: сервис должен принимать на вход массив URL'ов, анализировать страницы по этим адресам, и возвращать PDF документ, в котором в таблице будут представлены три наиболее часто встречающихся слова длиннее 4 символов по каждому из URL'ов.

# install
`npm install`
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
