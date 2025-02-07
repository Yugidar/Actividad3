const express = require('express');
const routerPrueba = require("./")
const app = express();
const PORT = 3000;
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');

app.use(express.json());

//Funciones
//funcion para leer JSON y obtener datos


async function obtenerTareas() {
    const data = await fs.readFile('tareas.json', 'utf8');
    return JSON.parse(data);
  }
  
async function guardarTareas(tareas) {
    await fs.writeFile('tareas.json', JSON.stringify(tareas));
  }



//Rutas 
//GET TAREAS
app.get('/',(req,res) => {
    
  //Logica para agregar la tarea al JSON
  res.send('Bienvenido a la app');
});

//POST TAREAS
app.post('/tareas', async(req,res) => {
  const tareaId = parseInt(req.params.id);
  let nuevaTarea = req.body
  const {titulo, descripcion} = req.body;
  
  var tareas = await obtenerTareas();
  tareas.push(tareaId,nuevaTarea);

  await guardarTareas(tareas);
  
  res.status(201).send(`La tarea ${titulo} fue creada exitosamente`)
});


 //PUT TAREAS
 app.put('/:id', async(req,res) => {
  const tareaId = parseInt(req.params.id);

  const datosNuevos = req.body;

  const tareas = await obtenerTareas();

  const tareaObjetivo = tareas.findIndex((tareita) => tareita.id === tareaId);
  if (!tareaObjetivo){
    res.status(401);
  }

  tareas[tareaObjetivo] = {...tareas[tareasObjetivo], ...datosNuevos};

  await guardarTareas(tareas);

  res.json(tareas[tareaObjetivo]);

});



  





//DELETE TAREAS
app.delete('/tareas',(req,res) => {
 
});





//AUTENTICACION Y SESIONES

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});














//Middleware para HTTP y basica
app.use("/", (req, res, next) =>{
  console.log(`Metodo ${req.method} recibido`)
  next()
})
