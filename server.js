const express = require("express")
const cors = require ("cors")
const app = express()
const bodyParser = require('body-parser');
const db = require('./firebase.js');
app.use(bodyParser.json());

app.use(cors());

app.get("/api", (req,res)=>{
    res.json({"users":["userOne","userTwo"]})
})  


app.post("/joinGroup", (req, res) => {
  try {
      const { groupId, userId } = req.body;

      // Verifica que se proporcionen los parámetros necesarios
      if (!groupId || !userId) {
          return res.status(400).json({ error: 'GroupID and UserID is required' });
      }

      const groupsRef = db.ref(`groups/${groupId}`);

      groupsRef.once('value', (groupInfo) => {
          const group = groupInfo.val();

          // Verifica si el grupo existe
          if (!group) {
              return res.status(404).json({ error: 'Group not found' });
          }

          // Verifica que el grupo tenga el rol correcto para permitir unirse
          if (group.rol !== 1) {
              return res.status(400).json({ error: 'Cannot join this group.' });
          }

          // Agrega al usuario al grupo
          const userRef = db.ref(`users/${userId}/groups`);
          userRef.push({ codigo: groupId });

          res.status(200).json({ success: true, message: 'User joined.' });
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Bad request.' });
  }
});


app.delete("/deleteGroup/:groupId", (req, res) => {
  try {
      const groupId = req.params.groupId;

      // Verifica que se proporcione el parámetro necesario
      if (!groupId) {
          return res.status(400).json({ error: 'groupId is required to delete a group.' });
      }

      const groupsRef = db.ref(`groups/${groupId}`);

      groupsRef.once('value', (groupInfo) => {
          const group = groupInfo.val();

          // Verifica si el grupo existe
          if (!group) {
              return res.status(404).json({ error: 'Group not found.' });
          }

          // Elimina el grupo
          groupsRef.remove();

          res.status(200).json({ success: true, message: 'Group deleted successfully.' });
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error in the request.' });
  }
});



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
    const { codigo,destino, members, rol } = req.body;
    const groupsRef = db.ref('groups');
    const newGroupRef = groupsRef.push({ codigo,destino, members, rol });
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

