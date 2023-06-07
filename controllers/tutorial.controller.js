const db = require("../models")
const Tutorial = db.tutorials;

const create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty! " });
        return;
    }

    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    });

    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while creating the Tutorial."
            });
        });
};

// Retrieve all Tutorial from the database

const findAll = (req, res) => {
    const title = req.body.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "1" } } : {};

    Tutorial.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving tutorials."
            });
        });
}

//Find a single tutorial with an Id
const findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Tutorial with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Tutorial with id-" + id });
        })
}

//update the tutorial by the id in the request
const update = (req,res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(400).send({
                    message: "Cannot update Tutorial with id-${id}.Maybe Tutorial was not found!"
                });
            } else res.send({ message: "Tutorial was upadted successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
}


//delete a Tutorial with the specified id in the request
const deletee=(req,res)=>{
    const id=req.params.id;

    Tutorial.findByIdAndRemove(id,{useFindAndModify:false})
    .then(data=>{
        if(!data){
            res.status(404).send({
                message:`Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
            })
        }else{
            res.send({
                message:"Tutorial was deleted succesfully!"
            })
        }
    })
    .catch(err=>{
        res.status(500).send({
            message:`Could not delted Tutorial with id=`+ id
        })
    })
}


//delete all tutorials from the db
const deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while removing all tutorials."
            })
        })
}

//find all published Tutorials
const findAllPublished = (req, res) => {
    Tutorial.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving tutorials."
            })
        })
}


module.exports={create,findAll,findOne,update,deletee,deleteAll,findAllPublished}