# site-analyzer

Первое отборочное задание для стажировки в Lad

Анализ текста на сайтах: сервис должен принимать на вход массив URL'ов, анализировать страницы по этим адресам, и возвращать PDF документ, в котором в таблице будут представлены три наиболее часто встречающихся слова длиннее 4 символов по каждому из URL'ов.

## Install
````
git clone https://github.com/ElectroForez/site-analyser.git
npm install
````

## Run

````
$ npm start

> site-analyser@1.0.0 start
> node main.js

Server running on http://localhost:3000

````

## Example of usage

````
curl --location --request POST 'http://localhost:3000/siteAnalyse' \
--header 'Content-Type: application/json' \
--data-raw '{
    "urls": ["http://yandex.ru", "http://habrahabr.ru"],
    "ignoreRegisters": true,
    "wordsCount": 3,
    "minWordLen": 5
}' \
--output result.pdf
````

## Swagger
After run, swagger is available on:

http://localhost:3000/documentation
