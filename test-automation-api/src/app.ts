import configuration from "@feathersjs/configuration";
import express from "@feathersjs/express";
import feathers, {
  HookContext as FeathersHookContext,
} from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import favicon from "serve-favicon";
import appHooks from "./app.hooks";
import channels from "./channels";
import { Application } from "./declarations";
import logger from "./logger";
import middleware from "./middleware";
import sequelize from "./sequelize";
import services from "./services";

const swagger = require("feathers-swagger"); // Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());

export type HookContext<T = any> = {
  app: Application;
} & FeathersHookContext<T>;
app.configure(
  swagger({
    uiIndex: true,
    docsPath: "/docs",
    specs: {
      info: {
        title: "Dopple APIs",
        description: "A description",
        version: "1.0.0",
      },
      schemes: ["http", "https"], // Optionally set the protocol schema used (sometimes required when host on https)
    },
  })
);
//swagger configuration
// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "refresh-token",
  ],
};
app.use(cors(corsOpts));
app.use(compress());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(favicon(path.join(app.get("public"), "favicon.ico")));
// Host the public folder
app.use("/", express.static(app.get("public")));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(sequelize);

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);
// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

export default app;
