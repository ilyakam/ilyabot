var eventController = require('./event-controller.js'),
    router = require('express').Router();

router.post('/', eventController.getEventHandler);

module.exports = router;
