const Voca = require('../models/vocaModel')


exports.getAll = (req, res)=>{
    Voca.find({}, (err, vocas)=>{
        var vocalist = {};
        vocas.forEach((vocaitem)=>{
            vocalist[vocaitem._id] = vocaitem;
        });
        res.send(vocalist);
    });
    
}

exports.create = (req, res)=>{
    const voca = new Voca({
        voca: req.body.voca,
        mean: req.body.mean
    })
    voca.save().then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.status(500).send(err.message)
    });
}

exports.check = (req, res)=>{
    Voca.findOne({_id: req.body._id}).then((value)=>
    {
        console.log(value);
        res.send(true);
    }).catch((err)=>{
        res.send(false);
    });
    
}