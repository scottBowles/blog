const router = require('express').Router();

router.get('/', (req, res) => {});
router.post('/', (req, res) => {});

router.get('/:postid', (req, res) => {});
router.put('/:postid', (req, res) => {});
router.delete('/:postid', (req, res) => {});

router.get('/:postid/comments', (req, res) => {});
router.post('/:postid/comments', (req, res) => {});

router.get('/:postid/comments/:commentid', (req, res) => {});
router.put('/:postid/comments/:commentid', (req, res) => {});
router.delete('/:postid/comments/:commentid', (req, res) => {});

module.exports = router;
