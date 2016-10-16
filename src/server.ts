/// <reference path="../typings/index.d.ts" />
import * as Hapi from "hapi";
import {IPlugin} from "./plugins/interfaces";
import {IServerConfigurations} from "./configurations";
import * as Person from "./person";
import {IDatabase} from "./database";


export function init(configs: IServerConfigurations, database: IDatabase) {
  const port = process.env.port || configs.port;
  const server = new Hapi.Server();

  server.connection({
    port: port,
    address: configs.address,
    routes: {
      cors: true
    }
  });


  server.ext("onPreResponse", function (request, reply) {

    var response = request.response;
/*
    var fullUrl = request.info.referrer;
    if(fullUrl){
      response.headers["Access-Control-Allow-Origin"] = fullUrl;
      response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type, Authorization";
      response.headers["Access-Control-Allow-Credentials"] = "true";
      response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, OPTIONS, DELETE";
      response.headers["Access-Control-Request-Headers"] = "Null, Accept";
    }
    */
    reply(response);
  });

  //  Setup Hapi Plugins
  const plugins: Array<string> = configs.plugins;
  const pluginOptions = {
    database: database,
    serverConfigs: configs
  };

  plugins.forEach((pluginName: string) => {
    var plugin: IPlugin = (require("./plugins/" + pluginName)).default();
    console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
    plugin.register(server, pluginOptions);
  });

  //Init Features
  Person.init(server, configs, database);
  return server;
};
