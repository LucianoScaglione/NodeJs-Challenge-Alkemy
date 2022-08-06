const { Personajes, PeliculasYSeries, Genero } = require('../db')
const { Op } = require("sequelize")

const allMovies = async (req, res) => {
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
      const searchGender = await PeliculasYSeries.findAll({ where: { GeneroId: gender } })
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
}

const detailMovie = async (req, res) => {
  try {
    const { id } = req.params
    const searchMov = await PeliculasYSeries.findAll({ where: { id: id }, include: Personajes })
    searchMov.length ? res.status(200).send(searchMov) : res.status(404).send("No existen películas con ese ID")
  } catch (error) {
    console.log(error)
  }
}

const createMovie = async (req, res) => {
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
}

const updateMovie = async (req, res) => {
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
}

const deleteMovie = async (req, res) => {
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
}

module.exports = {
  allMovies,
  detailMovie,
  createMovie,
  updateMovie,
  deleteMovie
}