const router = require('express').Router();

router.get('/', (req, res) => {});
router.post('/', (req, res) => {});

router.get('/:userid', (req, res) => {});
router.put('/:userid', (req, res) => {});
router.delete('/:userid', (req, res) => {});

router.get('/:userid/posts', (req, res) => {});
router.post('/:userid/posts', (req, res) => {});

router.get('/:userid/posts/:postid', (req, res) => {});
router.put('/:userid/posts/:postid', (req, res) => {});
router.delete('/:userid/posts/:postid', (req, res) => {});

module.exports = router;
