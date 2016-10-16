import * as Hapi from "hapi";
import * as Boom from "boom";
import { IPerson } from "./PersonModel";
import { IDatabase } from "../database";
import { IServerConfigurations } from "../configurations";

export default class PersonController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public Get(request: Hapi.Request, reply: Hapi.IReply) {
        let id = request.params["id"];
        this.database.PersonModel.findOne({ _id: id }).lean(true).then((Person: IPerson) => {
            if (Person) {
                reply(Person);
            } else {
                reply(Boom.notFound());
            }
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public GetAll(request: Hapi.Request, reply: Hapi.IReply) {
        let top = request.query.top;
        let skip = request.query.skip;

        this.database.PersonModel.find().lean(true).skip(skip).limit(top).then((Persons: Array<IPerson>) => {
            reply(Persons);
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public Create(request: Hapi.Request, reply: Hapi.IReply) {
        var newPerson: IPerson = request.payload;
        this.database.PersonModel.create(newPerson).then((Person) => {
            reply(Person).code(201);
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }

    public Update(request: Hapi.Request, reply: Hapi.IReply) {
        let id = request.params["id"];
        let Person: IPerson = request.payload;

        this.database.PersonModel.findByIdAndUpdate({ _id: id}, { $set: Person }, { new: true })
            .then((updatedPerson: IPerson) => {
                if (updatedPerson) {
                    reply(updatedPerson);
                } else {
                    reply(Boom.notFound());
                }
            }).catch((error) => {
                reply(Boom.badImplementation(error));
            });
    }

    public Remove(request: Hapi.Request, reply: Hapi.IReply) {
        let id = request.params["id"];
        this.database.PersonModel.findOneAndRemove({ _id: id}).then((deletedTask: IPerson) => {
            if (deletedTask) {
                reply(deletedTask);
            } else {
                reply(Boom.notFound());
            }
        }).catch((error) => {
            reply(Boom.badImplementation(error));
        });
    }
}