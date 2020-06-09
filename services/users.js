const axios = require('axios');
const geolib = require('geolib');
const _ = require('lodash');
const constants = require('./constants');

const getCityUsers = (city) => axios.get(`https://bpdts-test-app.herokuapp.com/city/${city}/users`);
const getAllUsers = () => axios.get('https://bpdts-test-app.herokuapp.com/users');

const calculateDistance = (from, to) => {
    const distanceMtrs = geolib.getDistance(from, to);
    return geolib.convertDistance(distanceMtrs, "mi");
}

const getUsersByDistance = async (city, distance) => {
    const allUsers = await getAllUsers();
    return allUsers.data.filter(({latitude, longitude}) => {
      return calculateDistance(city, {latitude, longitude}) <= distance;
    });
}

const getResults = async (req, res) => {
    try {
      const usersFromCity = getCityUsers(req.params.city);
      const usersByCityDistance = getUsersByDistance(constants[req.params.city], 50);
      
      const [londonUsers, filteredUsers] = await Promise.all([usersFromCity, usersByCityDistance]);
      
      res.status(200).json(_.union(londonUsers.data, filteredUsers));
    } catch(errors) {
      res.send(errors);
    }
  }


module.exports = {
    getResults,
    getCityUsers,
    getAllUsers,
    calculateDistance,
    getUsersByDistance
  }