const router = require('express').Router();

router.get('/posts', (req, res) => {});
router.post('/posts', (req, res) => {});

router.get('/posts/:postid', (req, res) => {});
router.put('/posts/:postid', (req, res) => {});
router.delete('/posts/:postid', (req, res) => {});

router.get('/posts/:postid/comments', (req, res) => {});
router.post('/posts/:postid/comments', (req, res) => {});

router.get('/posts/:postid/comments/:commentid', (req, res) => {});
router.put('/posts/:postid/comments/:commentid', (req, res) => {});
router.delete('/posts/:postid/comments/:commentid', (req, res) => {});

module.exports = router;
