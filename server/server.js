const express = require("express")
const app = express()

app.get("/api", (req,res)=>{
    res.json({"users":["userOne","userTwo"]})
})  

app.get("/getTouristGroups/:id",(req,res)=>{

})

app.post("/createTouristGroup/:id",(req,res)=>{

})

app.get("/operatorGroups/:id", (req,res)=>{

})

app.post("register/", async (req,res)=>{

})

app.listen(5000,()=>{console.log("Servidor iniciado en el puerto 5000")})

