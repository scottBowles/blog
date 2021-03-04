import express from 'express';

const router = express.Router();

// What is the index route here? There's no obvious resource
router.get('/', (req, res) => { });

router.post('/log-in', (req, res) => { });
// router.post('/sign-up', (req, res) => {}); --> covered as users POST
router.get('/log-out', (req, res) => { });

export default router;
