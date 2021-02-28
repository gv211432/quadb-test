const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
app = express();
const port = process.env.PORT;
const api_URL = process.env.API_URL;
const fetch = require('node-fetch');
const fs = require('fs');

let url = api_URL;
let settings = { method: "Get" };

app.use(express.static(__dirname + '/public'));


// Function for injecting table data 
const row = html => `<tr>\n${html}</tr>\n`,
    heading = object => row(Object.keys(object).reduce((html, heading) => (html + `<th>${heading}</th>`), '')),
    datarow = object => row(Object.values(object).reduce((html, value) => (html + `<td>${value}</td>`), ''));


function htmlTable(dataList) {
    return `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HoldInfo.com</title>
   <link rel="stylesheet" href="./style.css">
</head>

<body>
    <!-- =================Header starts============================== -->
    <br>
    <div id="head-content">
        <div id="img-content">
            <img src="./holdinfo.png" alt="HOLDINFO.COM">
        </div>
        <div id="buttons-inr-btc">
            <span>
                <p>INR<p1 style="font-size: 10px;">&#9660</p1>
                </p>
                <p>BTC<p1 style="font-size: 10px;">&#9660</p1>
                </p>
            </span>
        </div>
        <div id="circle">
            <p>58</p>
        </div>
        <div id="telegram">
            <p> <img src="./tele.png" alt="telegram" style="color: rgb(61, 198, 193);
                vertical-align: middle; padding-left:6px ;">
                Connect Telegram</p>
        </div>
        <div id="toggle-me">
            <label class="switch">
                <input type="checkbox">
                <span class="slider round"></span>
            </label>
        </div>
    </div>
        <!-- ========================Header Ends======================= -->
    <br>
        <!-- =======================Table starts============================= -->
    <div class="table-wrapper">
        <table class="fl-table">
            <thead>
                ${heading(dataList[0])}
            </thead>
            <tbody>
                ${dataList.reduce((html, object) => (html + datarow(object)), '')}
            <tbody>
        </table>
    </div>
        <!-- =============================Table Ends================================= -->
</body>

</html>
   `
}


// apps home page 
app.get('/', (req, res) => {
    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            counter = 0;
            receivedData = [];
            for (x in json) {
                if (counter <= 9) {
                    eX = {};
                    eX['#'] = counter + 1;
                    eX["name"] = json[x].name;
                    eX["Last"] = "₹ " + json[x].last;
                    eX["Buy/Sell Price"] = "₹ " + json[x].buy + "/₹ " + json[x].sell;
                    eX['volume'] = json[x].volume;
                    eX['base_unit'] = json[x].base_unit;
                    receivedData.push(eX);
                }
                counter++;
            }

            res.send(htmlTable(receivedData));
        });
})


// starting the server on the port 
app.listen(port, () => {
    console.log('Server runnig on ' + port);
})
