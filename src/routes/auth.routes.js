const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.post('/login', async (req, res) => {
    console.log('req.db:', req.db);
    console.log('req.body:', req.body)
    
    let validate = await User.findByMicrosoftId(req.db, req.body.microsoft_id);

    if(validate === null){
        let newUser = await User.create(req.db, req.body);
        return res.json({ user: newUser});
    }

    return res.status(400).json({ user:validate});

})

module.exports = router;