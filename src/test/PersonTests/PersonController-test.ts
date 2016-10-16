/// <reference path="../../../typings/index.d.ts" />
import * as chai from "chai";
import * as Configs from "../../configurations";
import * as Server from "../../server";
import * as Database from "../../database";
import * as Utils from "../utils";

const configDb = Configs.getDatabaseConfig();
const database = Database.init(configDb);
const assert = chai.assert;
const serverConfig = Configs.getServerConfigs();
const server = Server.init(serverConfig, database);

describe("Person Controller Tests", () => {

    beforeEach((done) => {
        Utils.createSeedPersonData(database, done);
    });

    afterEach((done) => {
        Utils.clearDatabase(database, done);
    });

    it("List of Person", (done) => {
        var person = {
            fisrt: "John",
            last: "Doe",
            dob: "smoke"
        };

        server.inject({ method: 'GET', url: '/person' }, (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it("Create Person", (done) => {
        var person = {
            first: "John",
            last: "Doe",
            dob: "1965-03-25"
        };

        server.inject({ method: 'POST', url: '/person', payload: person }, (res) => {
            assert.equal(201, res.statusCode);
            var responseBody: any = JSON.parse(res.payload);
            assert.isNotNull(responseBody.body);
            done();
        });
    });

    it("Create Person invalid data", (done) => {
        var person = {
            fisrt: "John",
            last: "Doe",
            dob: "smoke"
        };

        server.inject({ method: 'POST', url: '/person', payload: person }, (res) => {
            assert.equal(400, res.statusCode);
            done();
        });
    });

    it("Remove Person", (done) => {
        var person = {
            first: "John",
            last: "Doe",
            dob: "1965-03-25"
        };

        var responseBody;

        server.inject({ method: 'POST', url: '/person', payload: person }, (res) => {
            assert.equal(201, res.statusCode);
            responseBody = JSON.parse(res.payload);
            assert.isNotNull(responseBody.first);

            server.inject({ method: 'DELETE', url: '/person/' + responseBody._id }, (res) => {
                assert.equal(200, res.statusCode);
                var getBody = JSON.parse(res.payload);
                assert.equal(getBody.first, person.first);
                done();
            });

        });

    });

    it("Get Person", (done) => {
        var person = {
            first: "John",
            last: "Doe",
            dob: "1965-03-25"
        };

        var responseBody;

        server.inject({ method: 'POST', url: '/person', payload: person }, (res) => {
            assert.equal(201, res.statusCode);
            responseBody = JSON.parse(res.payload);
            assert.isNotNull(responseBody.first);

            server.inject({ method: 'GET', url: '/person/' + responseBody._id }, (res) => {
                assert.equal(200, res.statusCode);
                var getBody = JSON.parse(res.payload);
                assert.equal(getBody.first, person.first);
                done();
            });

        });

    });

    it("Update Person", (done) => {
        var person = {
            first: "John",
            last: "Doe",
            dob: "1965-03-25"
        };

        var responseBody;

        server.inject({ method: 'POST', url: '/person', payload: person }, (res) => {
            assert.equal(201, res.statusCode);
            responseBody = JSON.parse(res.payload);
            assert.isNotNull(responseBody.first);

            var updatePerson = {
                first: "Updated",
                last: responseBody.last,
                dob: responseBody.dob
            };

            server.inject({ method: 'PUT', url: '/person/' + responseBody._id, payload: updatePerson }, (res) => {
                assert.equal(200, res.statusCode);
                var updatedBody: any = JSON.parse(res.payload);
                assert.equal(updatedBody.first, updatePerson.first)
                done();
            });

        });

    });

});
