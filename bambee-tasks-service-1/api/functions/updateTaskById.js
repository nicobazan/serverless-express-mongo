const expressUtils = require("../../helpers/expressUtils");
const mongoUtils = require("../../helpers/mongoUtils");
const MONGODB_URI = process.env.MONGODB_URI;
const _getById = require('./getTaskById')._getById;
async function _updateTaskById(req,res,db, id){
    req.body._id = id;
    const resp = await mongoUtils.updateOne(db, req.body);
    return resp;
}
async function updateTaskById(req,res){
    const db = await mongoUtils.connect(MONGODB_URI);

    const token = expressUtils.getTokenFromRequest(req);
    const subjectId = expressUtils.getSubjectFromToken(token);

    const task = await _getById(req, res, db);
    console.log('task',task);
    if(!!task.length){

        if(task[0].subjectId === subjectId){
            await _updateTaskById(req,res,db,task[0]._id);
            res.status(200).send({id:task[0]._id});

        }
        // update here
        else
            res.status(403).send({errormessage:"UNAUTHORIZED"});
    }else
        res.status(404).send({errormessage:"ITEM DOES NOT EXIST"});

}

module.exports = {
    _updateTaskById,
    updateTaskById
};