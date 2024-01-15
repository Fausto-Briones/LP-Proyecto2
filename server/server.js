const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const db = require('./firebase.js');
app.use(bodyParser.json());
app.get("/api", (req,res)=>{
    res.json({"users":["userOne","userTwo"]})
})  

app.get("/getTouristGroups",(req,res)=>{

    try {
        const groupsRef = db.ref('groups');
    
        groupsRef.once('value', (gruposInfo) => {
          const groups = gruposInfo.val() || {};
          
          const touristGroups = Object.values(groups).filter(group => group && group.rol === 1);
    
          res.status(200).json(touristGroups);
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error con la peticion' });
      }
})

app.post("/createTouristGroup",(req,res)=>{

    try{
    const { codigo, members, rol } = req.body;
    const groupsRef = db.ref('groups');
    const newGroupRef = groupsRef.push({ codigo, members, rol });
    members.forEach((member) => {
        const userRef = db.ref(`users/${member.idUser}/groups`);
        userRef.push({ codigo: newGroupRef.key });
      });
      res.status(201).json({ success: true, message: 'Grupo creado correctamente' });
    }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la peticion' });
  }
});



app.get("/operatorGroups/:id", (req,res)=>{

})

app.post("register/", async (req,res)=>{

})

app.listen(5000,()=>{console.log("Servidor iniciado en el puerto 5000")})

