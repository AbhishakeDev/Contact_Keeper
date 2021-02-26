const express = require('express');
const router = express.Router();

// @route   POST api/users
//  @desc   resgister a user
// @access  public
router.post('/', (req, res) => {
    res.send('registers a user');
});

module.exports = router;