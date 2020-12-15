const router = require('express').Router();

router.get('/users', (req, res) => {});
router.post('/users', (req, res) => {});

router.get('/users/:userid', (req, res) => {});
router.put('/users/:userid', (req, res) => {});
router.delete('/users/:userid', (req, res) => {});

router.get('/users/:userid/posts', (req, res) => {});
router.post('/users/:userid/posts', (req, res) => {});

router.get('/users/:userid/posts/:postid', (req, res) => {});
router.put('/users/:userid/posts/:postid', (req, res) => {});
router.delete('/users/:userid/posts/:postid', (req, res) => {});

module.exports = router;
