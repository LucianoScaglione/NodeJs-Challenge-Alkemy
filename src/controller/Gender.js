const { Genero } = require('../db')

const allGender = async (req, res) => {
  try {
    const runDb = await Genero.findAll()
    runDb.length ? res.status(200).send(runDb) : res.status(404).send("No existen géneros creados")
  } catch (error) {
    console.log(error)
  }
}

const createGender = async (req, res) => {
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
}

const deleteGender = async (req, res) => {
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
}

module.exports = {
  allGender,
  createGender,
  deleteGender
}