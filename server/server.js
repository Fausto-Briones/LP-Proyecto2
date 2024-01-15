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



app.get("/operatorGroups/", (req,res)=>{
    try {
        const groupsRef = db.ref('groups');
    
        groupsRef.once('value', (info) => {
          const groups = info.val() || {};
          
          const operatorGroups = Object.values(groups).filter(group => group && group.rol === 2);
    
          res.status(200).json(operatorGroups);
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error con la peticion' });
      }
})

app.get("/operatorGroups/:id", (req,res)=>{
    try{
        db.ref("groups").once("value", (info) => {
            const groups = info.val() || {}
            const groupSelected = groups[req.params.id];

            if(groupSelected != null)
                if(groupSelected["rol"] == "2")
                    res.status(200).json(groupSelected);
                else
                    res.status(400).json({message: "El grupo no es de operadores"})
            else
                res.status(400).json({message: "No se encontró el grupo"});
        })
    }catch(error){
        res.status(400).send(error)
    }
})

app.post("/register", (req,res)=>{
    try{
        const {groups, rol, user} = req.body;
        const users = db.ref("users");
        users.push({user,rol,groups});
        res.status(200).json({success: true, message: "Registro exitoso"});
    }catch(error){
        res.status(400).send(error)
    }
})

app.listen(5000,()=>{console.log("Servidor iniciado en el puerto 5000")})

