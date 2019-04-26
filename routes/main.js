var router = require('express').Router()
var Photo = require('../models/photo')

var multer = require('multer')
var path = require('path')
var fs = require('fs')
var moment = require('moment');

var MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638'
}

function checkMagicNumbers(magic) {
    if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) return true
}


router.get('/add-photo', function(req, res, next) {
    res.render('main/add-photo')
})

router.post('/add-photo', function(req, res, next) {
    var upload = multer({
        storage: multer.memoryStorage()
    }).single('photo')
    upload(req, res, function(err) {
        if (req.file == undefined) {
            return;
        }

        var buffer = req.file.buffer
        var magic = buffer.toString('hex', 0, 4)
        var filename = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname)
        if (checkMagicNumbers(magic)) {
            fs.writeFile('./uploads/' + filename, buffer, 'binary', function(err) {
                if (err) throw err
                res.end('File is uploaded')

                var photoModel = new Photo();
                photoModel.event = req.body.photo_event
                photoModel.instagramHandle = req.body.photo_instagramhandle
                photoModel.method = req.body.photo_method
                photoModel.status = req.body.photo_status
                photoModel.device = req.body.photo_device
                photoModel.buffer = buffer
                photoModel.filename = filename
                photoModel.contentType = "image/png"
                photoModel.save();
            })
        } else {
            res.end('File is no valid')
        }
    })
})



router.get('/', function(req, res, next) {
    res.render('index')
})


router.get('/photos/:page', function(req, res, next) {
    var perPage = 9
    var page = req.params.page || 1

    Photo
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, photos) {
            Photo.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('main/photos', {
                    photos: photos,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    moment: moment
                })
            })
        })
})

module.exports = router