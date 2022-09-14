# site-analyser

Первое отборочное задание для стажировки в Lad

Анализ текста на сайтах: сервис должен принимать на вход массив URL'ов, анализировать страницы по этим адресам, и возвращать PDF документ, в котором в таблице будут представлены три наиболее часто встречающихся слова длиннее 4 символов по каждому из URL'ов.

Примерно так:

http://yandex.ru

Программирование | Санкт-Петербург | Маркет

## Install
````
git clone https://github.com/ElectroForez/site-analyser.git
cd site-analyser
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

Simple usage
````
curl --location --request POST 'http://localhost:3000/siteAnalyse' \
--header 'Content-Type: application/json' \
--data-raw '{
    "urls": ["http://yandex.ru", "http://habrahabr.ru", "http://not-exists.site"]
}
' \
--output result.pdf
````
More flexible usage
````
curl --location --request POST 'http://localhost:3000/siteAnalyse' \
--header 'Content-Type: application/json' \
--data-raw '{
    "urls": ["http://yandex.ru", "http://habrahabr.ru"],
    "analyse": {
        "wordsCount": 4,
        "ignoreRegister": true,
        "minWordLen": 4
    },
    "pdf": {
        "success": {
            "includeColumns": ["url", "values", "redirect"]
        },
        "errors": {
            "includeColumns": ["url", "error"]
        }
    }
}
' \
--output result.pdf
````

## Swagger
After run, swagger is available on:

http://localhost:3000/documentation

## Node.js version
Проект был изначально написан на Node.js, впоследствии был перенесён на TS.
С ней можно ознакомиться [здесь](https://github.com/ElectroForez/site-analyser/tree/nodejs-version)