const express = require('express');
const routerPrueba = require("./")
const app = express();
const PORT = 3000;
const fs = require('fs').promises;
//const jwt = require('jsonwebtoken');
//const SECRET_KEY = 'blitzcrank';

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
 app.put('/tareas/:id', async(req,res) => {
  const tareaId = parseInt(req.params.id);
  var id = [0]
  const datosNuevos = req.body;

  const tareas = await obtenerTareas();

  const tareaObjetivo = tareas.findIndex((tareita) => tareita.id === tareaId);
  if (tareaObjetivo === -1){
      return res.status(404).send(`Tarea con id ${tareaId} no encontrada`);
  }

  tareas[tareaObjetivo] = {...tareas[tareaObjetivo], ...datosNuevos};

  await guardarTareas(tareas);

  res.json(tareas[tareaObjetivo]);

  res.status(201).send(`se modifico`)

});



//DELETE TAREAS
app.delete('/tareas/:id',async(req,res) => {
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
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }

        req.user = user;
        next();
    });
};

//  registro
app.post('/register', async (req, res) => {
    const { user, password } = req.body;

    if (!user||!password) {
    return res.status(400).json({ message: 'Falta user o contraseña' });
}

try {
    const data = await fs.readFile('users.json', 'utf8');
    const users = JSON.parse(data);

    // Verificar si el user ya existe
    if (users.find(user => user.user === user)) {
        return res.status(400).json({ message: 'El user ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Agregar nuevo user al arreglo
    users.push({ user, password: hashedPassword });

    await fs.writeFile('users.json', JSON.stringify(users));

    console.log('user registrado:', user);

    res.status(201).json({ message: 'user registrado con éxito' });
} catch (err) {
    console.error('Error al registrar user:', err);
    res.status(500).json({ message: 'Error del servidor' });
}
});

// login
app.post('/login', async (req, res) => {
    const { user, password } = req.body;

    if (!user||!password) {
    return res.status(400).json({ message: 'Falta user o contraseña' });
}

try {
    const data = await fs.readFile('users.json', 'utf8');
    const users = JSON.parse(data);

    // Buscar el user en el arreglo
    const user = users.find(user => user.user === user);

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: 'user o contraseña incorrectos' });
    }

    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login exitoso', token });
} catch (err) {
    console.error('Error al hacer login:', err);
    res.status(500).json({ message: 'Error del servidor' });
}
});


//app.listen(PORT, () => {
//  console.log(`Servidor corriendo en el puerto ${PORT}`);
//});














//Middleware para HTTP y basica
app.use("/", (req, res, next) =>{
  console.log(`Metodo ${req.method} recibido`)
  next()
})
