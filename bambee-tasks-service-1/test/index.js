require('dotenv').config()

const lambda = require('../index').server;

const event = require('./getById.mock');

const init = async function(){
    const resp = await lambda(event,{});
    console.log(resp);
};
 init();