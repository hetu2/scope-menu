const express = require('express');
const path = require('path')

const port = 8080;

const app = express()


app.get('/*', function(req,res) {

    const extension = path.extname(req.originalUrl);

    if(!extension) {
        res.sendFile(path.join(__dirname,'./index.html'))
    }
    else {
        res.sendFile(path.join(__dirname,req.originalUrl))
    }
});

app.listen(port,function(err) {
    if(err) {
        console.log(err)
    }
    else {
        console.log('listening port: '+port)
    }
})

/*

// 1. match static files
app.use("/static", express.static("public"));
// 2. match API requests
app.use("/graphql", ...);
// 3. finally, match everything else
app.use("*", function(req, resp) {
  resp.sendFile("/public/index.html");
});

*/