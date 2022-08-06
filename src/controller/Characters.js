const { Personajes, PeliculasYSeries } = require('../db')
const { Op } = require("sequelize")

const allCharacters = async (req, res) => { // get y query
  try {
    const { name, age, weight, movies } = req.query
    const runDb = await Personajes.findAll({ attributes: ['imagen', 'nombre'] })
    if (!name && !age && !weight && !movies) {
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
      console.log("entro a movies: ", movies)
      const containerPeliculas = await Personajes.findAll({ include: [{ model: PeliculasYSeries, where: { id: movies } }] })
      containerPeliculas.length ? res.status(200).send(containerPeliculas) : res.status(404).send("No existen películas con ese ID")
    }
  } catch (error) {
    console.log(error)
  }
}

const detailCharacter = async (req, res) => {
  try {
    const { id } = req.params
    const searchChar = await Personajes.findOne({ where: { id: id }, include: PeliculasYSeries })
    searchChar ? res.status(200).send(searchChar) : res.status(404).send("No existe personaje con ese ID")
  } catch (error) {
    console.log(error)
  }
}

const createCharacter = async (req, res) => {
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
}

const updateCharacter = async (req, res) => {
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
}

const deleteCharacter = async (req, res) => {
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
}

module.exports = {
  allCharacters,
  detailCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter
}