const expressUtils = require("../../helpers/expressUtils");
const mongoUtils = require("../../helpers/mongoUtils");
const MONGODB_URI = process.env.MONGODB_URI;

async function _getById(req, res, db) {

    const _id = req.params.taskId;
    if (_id.length !== 24)
        res.status(400).send({errormessage: "BAD TASK ID"});

    const queryObj = {_id};
    return await mongoUtils.query(db, queryObj);
}

async function getById(req, res) {
    const token = expressUtils.getTokenFromRequest(req);
    const subjectId = expressUtils.getSubjectFromToken(token);
    const db = await mongoUtils.connect(MONGODB_URI);
    const task = await _getById(res, req, db, subjectId);
    console.log('task', task);
    if (!!task.length) {
        console.log('task', task);
        if (task[0].subjectId === subjectId)
            res.json(task[0]);
        else
            res.status(403).send({errormessage: "UNAUTHORIZED"});
    } else
        res.status(404).send({errormessage: "ITEM DOES NOT EXIST"});


}

module.exports = {
    _getById,
    getById
};