const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Genero', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING
        },
        imagen: {
            type: DataTypes.TEXT
        }
    }, { timestamps: false })
}