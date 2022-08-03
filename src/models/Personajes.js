const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Personajes', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        imagen: {
            type: DataTypes.TEXT
        },
        nombre: {
            type: DataTypes.STRING
        },
        edad: {
            type: DataTypes.INTEGER
        },
        peso: {
            type: DataTypes.STRING
        },
        historia: {
            type: DataTypes.TEXT
        }
    }, { timestamps: false })
}