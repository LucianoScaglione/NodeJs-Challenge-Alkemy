const { Router } = require('express');
const router = Router();
const { Personajes, PeliculasYSeries, Genero, User } = require('../db')
const { Op } = require("sequelize")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const bcrypt = require('bcryptjs');
// const sgMail = require('@sendgrid/mail')

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt
  console.log("el token es este: ", token)
  if (!token) {
    return res.status(403).send("Se requiere un token de autenticación")
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
  } catch (error) {
    return res.status(401).send(error)
  }
  return next();
}

// const enviarMail = (emailUsuario) => {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//   const message = {
//     to: emailUsuario, // Para usuario
//     from: 'lidar54583@runqx.com', // Sender verificado.
//     subject: '¡Bienvenido a la API de Disney!',
//     text: 'Esperamos que disfrutes de nuestra API'
//   }
//   sgMail.send(msg).then(() => {
//     console.log('Email de bienvenida enviado')
//   }).catch((error) => {
//     console.error(error)
//   });
// }

router.get('/characters', verifyToken, async (req, res) => {
  try {
    const { name, age, weight, movies } = req.query
    const runDb = await Personajes.findAll({ attributes: ['imagen', 'nombre'] })
    if (!name && !age && !weight) {
      runDb.length ? res.status(200).send(runDb) : res.send("No existen personajes creados")
    }
    if (name) {
      const containerNombre = await Personajes.findAll({ where: { nombre: { [Op.iLike]: `%${name}%` } } })
      containerNombre.length ? res.send(containerNombre) : res.send("No existen personajes con ese nombre")
    }
    else if (age) {
      const containerEdad = await Personajes.findAll({ where: { edad: age } })
      containerEdad.length ? res.send(containerEdad) : res.send("No existen personajes con esa edad")
    }
    else if (weight) {
      const containerPeso = await Personajes.findAll({ where: { peso: { [Op.iLike]: `%${weight}%` } } })
      containerPeso.length ? res.send(containerPeso) : res.send("No existen personajes con ese peso")
    }
    else if (movies) {
      const containerPeliculas = await Personajes.findAll({ include: [{ model: PeliculasYSeries, where: { id: movies } }] })
      containerPeliculas.length ? res.send(containerPeliculas) : res.send("No existen películas con ese ID")
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/movies', verifyToken, async (req, res) => {
  try {
    const { name, gender, order } = req.query
    const runDb = await PeliculasYSeries.findAll({ attributes: ['imagen', 'titulo', 'creacion'] })
    if (!name && !gender && !order) {
      runDb.length ? res.status(200).send(runDb) : res.status(404).send("No existen películas creadas")
    }
    else if (name) {
      const searchName = await PeliculasYSeries.findAll({ where: { titulo: { [Op.iLike]: `%${name}%` } } })
      searchName.length ? res.status(200).send(searchName) : res.status(404).send("No existen películas o series con ese nombre")
    }
    else if (gender) {
      const searchGender = await Genero.findAll({ where: { id: gender } })
      searchGender.length ? res.status(200).send(searchGender) : res.status(404).send("No existe género con ese ID")
    }
    else if (order) {
      if (order === 'ASC') {
        const orderAsc = await PeliculasYSeries.findAll()
        const resultAsc = orderAsc.sort((a, b) => new Date(a.creacion.split("/").reverse().join("/")) - new Date(b.creacion.split("/").reverse().join("/")))
        console.log("ASC: ", resultAsc)
        resultAsc.length ? res.status(200).send(resultAsc) : res.status(404).send("Algo falló en el órden")
      }
      else if (order === 'DESC') {
        const orderDes = await PeliculasYSeries.findAll()
        const resultDes = orderDes.sort((a, b) => new Date(b.creacion.split("/").reverse().join("/")) - new Date(a.creacion.split("/").reverse().join("/")))
        resultDes.length ? res.status(200).send(resultDes) : res.status(404).send("Algo falló en el órden")
      } else if (order !== 'ASC' || order !== 'DESC') {
        res.status(404).send("No existe esa opción de órden, pruebe con 'ASC' o 'DESC'")
      }
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/gender', verifyToken, async (req, res) => {
  try {
    const runDb = await Genero.findAll()
    runDb.length ? res.status(200).send(runDb) : res.status(404).send("No existen géneros creados")
  } catch (error) {
    console.log(error)
  }
})

router.get("/characters/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const searchChar = await Personajes.findOne({ where: { id: id }, include: PeliculasYSeries })
    searchChar ? res.status(200).send(searchChar) : res.status(404).send("No existe personaje con ese ID")
  } catch (error) {
    console.log(error)
  }
})

router.get('/movies/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const searchMov = await PeliculasYSeries.findAll({ where: { id: id }, include: Personajes })
    searchMov.length ? res.status(200).send(searchMov) : res.status(404).send("No existen películas con ese ID")
  } catch (error) {
    console.log(error)
  }
})

router.post('/characters', verifyToken, async (req, res) => {
  try {
    const { imagen, nombre, edad, peso, historia } = req.body
    if (!imagen || !nombre || !edad || !peso || !historia) {
      res.send("Datos incompletos")
    } else {
      let searchCharacter = await Personajes.findOne({ where: { nombre: nombre } })
      if (!searchCharacter) {
        const personajeCreado = await Personajes.create({
          imagen,
          nombre,
          edad,
          peso,
          historia,
        })
        res.status(200).send(personajeCreado)
      } else {
        res.status(404).send("Ya existe un personaje creado con ese nombre")
      }
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/movies', verifyToken, async (req, res) => {
  try {
    const { imagen, titulo, calificacion, creacion, GeneroId, personajes } = req.body
    if (!imagen || !titulo || !calificacion || !creacion) {
      res.send("Datos incompletos")
    } else {
      let searchMovie = await PeliculasYSeries.findOne({ where: { titulo: titulo } })
      if (!searchMovie) {
        const createdMovie = await PeliculasYSeries.create({
          imagen,
          titulo,
          calificacion,
          creacion,
          GeneroId
        })
        personajes.forEach(async (p) => {
          const foundChar = await Personajes.findOne({ where: { id: p } })
          if (foundChar) {
            await createdMovie.addPersonajes(foundChar)
          } else {
            res.status(404).send('No existen personajes con ese ID')
          }
        })
        res.status(200).send("Película creada correctamente")
      } else {
        res.status(404).send("Ya existe una película con ese título")
      }
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/gender', verifyToken, async (req, res) => {
  try {
    const { nombre, imagen } = req.body
    if (!nombre || !imagen) {
      res.send("Datos incompletos")
    } else {
      let searchGender = await Genero.findOne({ where: { nombre: nombre } })
      if (!searchGender) {
        await Genero.create({
          nombre,
          imagen
        })
        res.status(200).send("Género creado correctamente")
      } else {
        res.status(404).send("Ya existe un género con ese nombre")
      }
    }
  } catch (error) {
    console.log(error)
  }
})
//////////////
router.post('/auth/register', async (req, res) => {
  try {
    // Obtener input.
    const { name, email, password } = req.body;

    // Validar input del usuario.
    if (!(email && password && name)) {
      res.status(400).send("Se requiere rellenar todos los campos: nombre, mail y password");
    }

    // Checkear si el usuario ya existe.
    const searchUser = await User.findOne({ where: { email: email } });
    if (searchUser) {
      return res.status(409).send("Este email ya está registrado")
    }

    // Encriptar la contraseña del usuario.
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la DB.
    const user = await User.create({
      name,
      email: email.toLowerCase(), // Convertir el mail a minúsculas.
      password: encryptedPassword
    });

    // Enviar email de bienvenida al nuevo usuario registrado.
    // enviarMail(email);  

    // Crear token.
    const token = jwt.sign({ user_id: user.id, email }, "secret", { expiresIn: "10h" });

    // Guardar token.
    user.token = token;

    // Devolver nuevo usuario.
    res.status(201).json({
      "user": user,
      "token": token
    })
  } catch (err) {
    console.log(err);
  }
})

router.post('/auth/login', async (req, res) => {
  try {
    // Obtener input.
    const { email, password } = req.body;

    // Validar input.
    if (!(email && password)) {
      res.status(400).send("Se requiere rellenar los campos: email y password")
    }

    // Validar si el usuario existe en la DB.
    const user = await User.findOne({ where: { email: email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Crear token.
      const token = jwt.sign({ user_id: user.id, email }, "secret", { expiresIn: "10h" });

      // Guardar token.
      user.token = token;
      res.cookie('jwt', token)

      // Devolver user.
      res.status(201).json({
        "user": user,
        "token": token
      })
    } else {
      res.status(400).send("Usuario incorrecto")
    }
  } catch (err) {
    console.log(err);
  }
})
//////////////
router.put("/characters/:id", verifyToken, async (req, res) => {
  try {
    const { imagen, nombre, edad, peso, historia } = req.body
    const { id } = req.params
    const searchChar = await Personajes.findOne({ where: { id: id } })
    if (searchChar) {
      const updateChar = searchChar.update({
        imagen: imagen ? imagen : searchChar.imagen,
        nombre: nombre ? nombre : searchChar.nombre,
        edad: edad ? edad : searchChar.edad,
        peso: peso ? peso : searchChar.peso,
        historia: historia ? historia : searchChar.historia,
      })
      res.status(200).send("Personaje actualizado")
    } else {
      res.status(404).send("No existe ningún personaje con ese ID")
    }
  } catch (error) {
    console.log(error)
  }
})

router.put("/movies/:id", verifyToken, async (req, res) => {
  try {
    const { imagen, titulo, calificacion, creacion } = req.body
    const { id } = req.params
    const searchMov = await PeliculasYSeries.findOne({ where: { id: id } })
    if (searchMov) {
      const updateMov = searchMov.update({
        imagen: imagen ? imagen : searchMov.imagen,
        titulo: titulo ? titulo : searchMov.titulo,
        calificacion: calificacion ? calificacion : searchMov.calificacion,
        creacion: creacion ? creacion : searchMov.creacion,
      })
      res.status(200).send("Película actualizada")
    } else {
      res.status(404).send("No existe ninguna película con ese ID")
    }
  } catch (error) {
    console.log(error)
  }
})

router.delete("/characters/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const deleteChar = await Personajes.destroy({ where: { id: id } })
    if (deleteChar) {
      res.status(200).send("Se eliminó el personaje")
    } else {
      res.status(404).send("No existe ningún personaje con ese ID")
    }
  } catch (error) {
    console.log(error)
  }
})

router.delete("/movies/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const deleteMov = await PeliculasYSeries.destroy({ where: { id: id } })
    if (deleteMov) {
      res.status(200).send("Se eliminó la película")
    } else {
      res.status(404).send("No existe ninguna película con ese ID")
    }
  } catch (error) {
    console.log(error)
  }
})

router.delete('/gender/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const deleteGen = await Genero.destroy({ where: { id: id } })
    if (deleteGen) {
      res.status(200).send("Se eliminó el género")
    } else {
      res.status(404).send("No existe ningún género con ese ID")
    }
  } catch (error) {
    console.log(error)
  }
})


module.exports = router;




