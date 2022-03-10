module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
        username: DataTypes.STRING,
        currentScore: {
            type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
        highScore: {
            type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};