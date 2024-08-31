const express = require('express');
const path = require('path');
const app = express();

const port = 8080;

const publicPath = path.resolve(__dirname, 'public');

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at ${ port }`);
});