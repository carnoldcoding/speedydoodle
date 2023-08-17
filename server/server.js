const express = require('express');
const app = express()
const ImageKit = require('imagekit');
const port = 3001

const imagekit = new ImageKit({
    publicKey: 'public_VntN1f83hpwvwaoz0rzDdpKFGzg',
    privateKey: 'private_4AHVbwrY0p4KnHo4RNbzMVAPuEY=',
    urlEndpoint: 'https://ik.imagekit.io/4hll6ncue/'
})



app.get("/api", (req, res) => {
    imagekit.listFiles({
        skip: 0,
        limit: 10
    }, (error, result)=>{
        error ? res.status(500).json({error: "Error"}) : res.json(result);
    });
})

app.listen(port, () => {
    console.log("Server Started on Port " + port);
})