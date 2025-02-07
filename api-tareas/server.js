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
app.get('/tareas',async (req,res) => {
   
  var tareas = await obtenerTareas(); 
  //Logica para agregar la tarea al JSON
  res.send(`Bienvenido a la app Las tareas actuales son ${JSON.stringify(tareas)} `);

});

//POST TAREAS
app.post('/tareas', async(req,res) => {
  //const tareaId = parseInt(req.params.id);


  let nuevaTarea = req.body

  const {titulo, descripcion} = req.body;
  
  var tareas = await obtenerTareas();

  const indice = Object.keys(tareas)
  var newindice = indice.length > 0 ? Math.max(...indice.map(Number))+1:1;
  const tarea = {id: newindice,titulo,descripcion};
 
  //tareas.push(newindice,nuevaTarea);
  tareas.push(tarea);

  await guardarTareas(tareas);

  res.status(201).send(`La tarea ${titulo} fue creada exitosamente`)
});


 //PUT TAREAS
 app.put('/:id', async(req,res) => {
  const tareaId = parseInt(req.params.id);
  var id = [0]
  const datosNuevos = req.body;

  const tareas = await obtenerTareas();

  const tareaObjetivo = tareas.findIndex((tareita) => tareita.id === tareaId);
  if (!tareaObjetivo){
    res.status(401);
  }

  tareas[tareaObjetivo] = {...tareas[tareaObjetivo], ...datosNuevos};

  await guardarTareas(tareas);

  res.json(tareas[tareaObjetivo]);

  res.status(201).send(`se modifico`)

});



  





//DELETE TAREAS
app.delete('/:id',async(req,res) => {
  const tareaId = parseInt(req.params.id);
  var id = [0]


  const tareas = await obtenerTareas();

  const tareaObjetivo = tareas.findIndex((tareita) => tareita.id === tareaId);
  if (tareaObjetivo === -1){
    res.status(401);
  }

  tareas.splice(tareaObjetivo, 1);

  await guardarTareas(tareas);


  res.status(200).send(`Tarea ${tareaId} eliminada`);
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
