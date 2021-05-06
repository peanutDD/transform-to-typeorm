import dotenv from 'dotenv'
dotenv.config()

const isTestEnvironment = process.env.NODE_ENV === "test";
const isProdEnvironment = process.env.NODE_ENV === "production";

export default {
	environment: process.env.NODE_ENV || "development",
	host: process.env.APP_HOST || "127.0.0.1",
	port:
		(isTestEnvironment ? process.env.TEST_APP_PORT : process.env.APP_PORT) ||
		"3000",
	auth: {
		secretKey: process.env.JWT_SECRET_KEY || "4C31F7EFD6857D91E729165510520424",
		adminSecretKey:
			process.env.ADMIN_JWT_SECRET_KEY || "4C31F7EFD6857D91E729165510520424",
	},
	typeorm: {
		db: {
			host: isTestEnvironment ? process.env.TEST_DB_HOST : process.env.DB_HOST,
			port: isTestEnvironment ? process.env.TEST_DB_PORT : process.env.DB_PORT,
			database: isTestEnvironment
				? process.env.TEST_DB_DATABASE
				: process.env.DB_DATABASE,
			type: isTestEnvironment ? process.env.TEST_DB_TYPE : process.env.DB_TYPE,
			username: process.env.DB_USERNAME || "postgres",
			password: process.env.DB_PASSWORD || "2486",
		},
		synchronize: !isProdEnvironment,
		logging: !isProdEnvironment,
	},
	superAdmin: {
		username: process.env.SUPER_ADMIN_USERNAME || "peanut",
		password: process.env.SUPER_ADMIN_PASSWORD || "2486",
	},
	basicAdmin: {
		username: process.env.BASIC_ADMIN_USERNAME || "ben",
		password: process.env.BASIC_ADMIN_PASSWORD || "2486",
	},
	user: {
		username: process.env.USERNAME || "bird",
		password: process.env.PASSWORD || "2486",
		email: process.env.EMAIL || "www.smoking.sexy@gmail.com",
	},
	logging: {
		dir: process.env.LOGGING_DIR || "logs",
		level: process.env.LOGGING_LEVEL || "debug",
	},
};
