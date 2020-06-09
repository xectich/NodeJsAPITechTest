const server = require("../app");
const nock = require('nock');
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const testData = require('../tests/test_data');
const services = require('../services/users');
const constants = require('../services/constants');

describe("users.getCityUsers", () => {
    it("Expecting an array full of users from London when inputing valid city", async () => {
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/city/London/users')
        .reply(200, testData.usersByCityData);
  
      return services.getCityUsers("London")
        .then( result => {
          expect(result).to.have.status(200);
          expect(result.data).to.have.lengthOf(6);
        });
  
    });
  
    it("Expecting an empty array when providing invalid input", async () => {
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/city/INVALID/users')
        .reply(200, []);
  
      return services.getCityUsers("INVALID")
        .then( result => {
          expect(result).to.have.status(200);
          expect(result.data).to.have.lengthOf(0);
        });
  
    });
  });
  
  describe("users.calculateDistance", () => {
    it("Expected correct calculation of distnace by providing valid pair of lat/lng", async () => {
  
      const place1 = { latitude: 51.509865, longitude: -0.118092 };
      const place2 = { latitude: 51.752022, longitude: -1.257677 };
  
      const result = services.calculateDistance(place1, place2);
  
      return expect(result).to.equal(51.716102958721066);
    })
  });
  
  describe("users.getUsersByDistance", () => {
    it("Expecting results to be filtered by the inputed distance", async () => {
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/users')
        .reply(200, testData.allUsersData);
  
      const london = constants.London;
  
      return services.getUsersByDistance(london, 50)
        .then(result => {
          expect(result).to.have.lengthOf(2);
        });
    });
  
    it("Expecting empty array when users are not found in set distance", async () => {
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/users')
        .reply(200, testData.noLondonUsersData);
  
      const london = constants.London;
  
      return services.getUsersByDistance(london, 50)
        .then(result => {
          expect(result).to.have.lengthOf(0);
        });
    });
  });
  
  describe("users.getResults", () => {
    it("Expected the combination result of People living in radius of 50km and in London", async () => {
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/users')
        .reply(200, testData.allUsersData);
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/city/London/users')
        .reply(200, testData.usersByCityData);
  
        chai.request(server)
          .get('/users/London')
          .end((error, result) => {
              expect(result.body).to.have.lengthOf(8);
          })
  
    });
  
    it("Expecting an error when retrieval of data fails", async () => {
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/users')
        .reply(404, testData.allUsersData);
  
      nock('https://bpdts-test-app.herokuapp.com')
        .get('/city/London/users')
        .reply(200, testData.usersByCityData);
  
        chai.request(server)
          .get('/users/London')
          .end((error, result) => {
            expect(result).to.have.status(200);
            expect(result.body.message).to.contain('404');
          });
  
    })
  })