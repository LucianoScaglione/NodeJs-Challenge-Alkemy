const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('PeliculasYSeries', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        imagen: {
            type: DataTypes.TEXT
        },
        titulo: {
            type: DataTypes.STRING
        },
        creacion: {
            type: DataTypes.STRING
        },
        calificacion: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 5
            }
        }
    }, { timestamps: false })
}