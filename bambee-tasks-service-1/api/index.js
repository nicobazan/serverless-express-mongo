const express = require('express');
const mongoUtils = require('../helpers/mongoUtils');
const router = express.Router();
const MONGODB_URI = process.env.MONGODB_URI;
const checkJwt = require('../middleware/auth').checkJwt;
const expressUtils = require('../helpers/expressUtils')
const functions = require('./functions/index');

router.get('/tasks', checkJwt, async (req, res) => {
    const db = await mongoUtils.connect(MONGODB_URI);

    const token = expressUtils.getTokenFromRequest(req);
    const subjectId = expressUtils.getSubjectFromToken(token);
    const queryObj = {subjectId};
    const resp = await mongoUtils.query(db, queryObj);
    res.json({message: resp});
});

router.get('/tasks/:taskId',checkJwt, async (req, res) => {

    const db = await mongoUtils.connect(MONGODB_URI);

    const token = expressUtils.getTokenFromRequest(req);
    const subjectId = expressUtils.getSubjectFromToken(token);

    const _id = req.params.taskId;
    if (_id.length !== 24)
        res.status(400).send({errormessage: "BAD TASK ID"});

    const queryObj = {_id};
    const task = await mongoUtils.query(db, queryObj);
    console.log('task', task);
    if (!!task.length) {
        console.log('task', task);
        if (task[0].subjectId === subjectId)
            res.json(task[0]);
        else
            res.status(403).send({errormessage: "UNAUTHORIZED"});
    } else
        res.status(404).send({errormessage: "ITEM DOES NOT EXIST"});


});

router.post('/tasks', checkJwt, async (req, res) => {
    const db = await mongoUtils.connect(MONGODB_URI);

    const token = expressUtils.getTokenFromRequest(req);
    const subjectId = expressUtils.getSubjectFromToken(token);
    req.body.status = 'new';
    req.body.subjectId = subjectId;
    const id = await mongoUtils.insertOne(db, req.body);
    // {
    //     status:'new',
    //     subjectId:subjectId,
    //     name:'first task',
    //     details:'clean your room',
    //     dueDate: new Date()
    // }

    console.log(id);


    res.json(id);
});

router.put('/tasks/:taskId',checkJwt, async (req, res) => {

    req.body = JSON.parse(req.body);
    await functions.updateTaskById(req, res);

});

router.delete('/tasks/:taskId', (req, res) => {
    res.json({message: 'deleted task'});
});


/*
* get all tasks [GET]
* get task by id [GET]
* create task [POST]
* delete task [DELETE]
* update task [PUT]
* */
module.exports = router;