const http = require("http");
const fs = require("fs");
var requests = require('requests');

const homeFile = fs.readFileSync("Home.html", "utf-8");

const replaceval = (tempval, orgvalue) => {

    let temprature = tempval.replace("{%tempval%}", orgvalue.main.temp);
    temprature = temprature.replace("{%tempmin%}", orgvalue.main.temp_min);
    temprature = temprature.replace("{%tempmax%}", orgvalue.main.temp_max);
    temprature = temprature.replace("{%country%}", orgvalue.sys.country);
    temprature = temprature.replace("{%location%}", orgvalue.name);
    temprature = temprature.replace("{%tempstatus%}", orgvalue.weather[0].main);

    

    return temprature;
}




const server = http.createServer((req, res) => {


    if (req.url === "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=pune&appid=0ac73d9620f2db642aebdf83bebddead')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];


                const realtimedata = arrData.map((val) => replaceval(homeFile, val))
                    .join("")//by default in array format now in string format;


                res.write(realtimedata);
            //     console.log(realtimedata);
            })

            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });

    }



});

server.listen(8000, "127.0.0.1");

