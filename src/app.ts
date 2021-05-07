// express
import express, { Express, Request, Response, Router } from "express";

import "reflect-metadata";

// routes
import rootRoutes from "./routes";

// datbase
import { createConnection } from "typeorm";

// config
import config from "./config/config";

// middleware
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// logger
import { Logger, ILogger } from "./utils/logger";

// error handler
import errorMiddleware from "./middlewares/error.middleware";
import notFoundError from "./middlewares/notFoundHandler.middleware";

// .env
import dotenv from 'dotenv'
dotenv.config()

// tools
import { classToPlain } from "class-transformer";

export class Application {
	app: Express;
	router: Router = express.Router();
	logger: ILogger;
	config = config;

	constructor() {
		this.logger = new Logger(__filename);
		this.app = express();
		// this.app.use(require("express-status-monitor")());
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(
			morgan("dev", {
				skip: () => config.environment === "test",
			})
		);

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));

		this.app.get("/", (_req: Request, res: Response) => {
			res.json({
				message: "hello world",
			});
		});

		this.initRoutes()

		this.app.use(notFoundError);
		this.app.use(errorMiddleware);
	}

	initRoutes = async () => {
		rootRoutes.forEach((route) => {
			this.app.use(
				"/api",
				(this.router as any)[route.method](
					route.route,
					route.middlewares,
					(req: Request, res: Response, next: Function) => {
						const result = new (route.controller as any)()[route.action](
							req,
							res,
							next
						);
						if (result instanceof Promise) {
							result.then((result) =>
								result !== null && result !== undefined
									? res.json({ success: true, data: classToPlain(result) })
									: res.status(404).json({success: false})
							)
							.catch(e => next(e))
						} else if (result !== null && result !== undefined) {
							res.json(result);
						}
					}
				)
			);
		});
	}
	setupDb = async () => {
		try {
			await createConnection();
		} catch (error) {
			console.log(error);
		}
	};

	startServer = (): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			this.app
				.listen(3000, () => {
					this.logger.info(`Server started at http://${this.config.host}:${this.config.port}`);
					resolve(true);
				})
				.on("error", (err) => this.logger.error(err.toString(), reject(false)));
		});
	};

	// createUser = async () => {
	// 	createConnection().then(async (connection) => {
	// 		await connection.manager.save(
	// 			connection.manager.create(User, {
	// 				username: "Timber",
	// 				email: "765285878@qq.com",
	// 				password: "2486",
	// 			})
	// 		);
	// 		await connection.manager.save(
	// 			connection.manager.create(User, {
	// 				username: "Phantom",
	// 				email: "1444135291@qq.com",
	// 				password: "2486",
	// 			})
	// 		);
	// 	});
	// };

	setupDbAndServer = async () => {
		try {
			await this.setupDb();
			await this.startServer();
			// await this.createUser();
			// await this.createAdmin();
		} catch (error) {
			this.logger.error(error)
		}
	};
}
