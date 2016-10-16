import {IPlugin, IPluginInfo} from "../interfaces";
import * as Hapi from "hapi";

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server) => {
      server.register([
          require("inert"),
          require("vision"),
          {
            register: require("hapi-swagger"),
            options: {
              info: {
                title: "Hapi Basic Api",
                description: "Meetup Api Documentation",
                version: "1.0"
              },
              tags: [
                {
                  "name": "person",
                  "description": "Api person interface."
                }
              ],
              //enableDocumentation: true,
              documentationPath: "/docs"
            }
          }
        ]
        , (error) => {
          if (error) {
            console.log("error", error);
          }
        });
    },
    info: () => {
      return {
        name: "Swagger Documentation",
        version: "7.2.0"
      };
    }
  };
};
