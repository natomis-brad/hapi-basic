import * as Hapi from "hapi";
import * as Joi from "joi";
import PersonController from "./PersonController";
import * as PersonValidator from "./PersonValidator";
import {IDatabase} from "../database";
import {IServerConfigurations} from "../configurations";

export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

  const pc = new PersonController(configs, database);
  server.bind(pc);

  server.route({
    method: "GET",
    path: "/person/{id}",
    config: {
      handler: pc.Get,
      auth: false,
      tags: ["api", "person"],
      description: "Get person by id.",
      validate: {
        params: {
          id: Joi.string().required()
        }
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              "description": "Person found."
            },
            "404": {
              "description": "Person does not exists."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "GET",
    path: "/person",
    config: {
      handler: pc.GetAll,
      auth: false,
      tags: ["api", "person"],
      description: "Get all people.",
      validate: {
        query: {
          top: Joi.number().default(5),
          skip: Joi.number().default(0)
        }
      }
    }
  });

  server.route({
    method: "DELETE",
    path: "/person/{id}",
    config: {
      handler: pc.Remove,
      auth: false,
      tags: ["api", "person"],
      description: "Delete person by id.",
      validate: {
        params: {
          id: Joi.string().required()
        }
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              "description": "Deleted Person.",
            },
            "404": {
              "description": "Person does not exist."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/person/{id}",
    config: {
      handler: pc.Update,
      auth: false,
      tags: ["api", "person"],
      description: "Update person by id.",
      validate: {
        params: {
          id: Joi.string().required()
        },
        payload: PersonValidator.updatePersonModel
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              "description": "Updated Person.",
            },
            "404": {
              "description": "Person does not exist."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "POST",
    path: "/person",
    config: {
      handler: pc.Create,
      auth: false,
      tags: ["api", "person"],
      description: "Create a person.",
      validate: {
        payload: PersonValidator.createPersonModel
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "201": {
              "description": "Created Person."
            }
          }
        }
      }
    }
  });

}
