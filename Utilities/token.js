const jwt = require("jsonwebtoken");

const createAndSendToken = ({id, email}, req, res) => {
        
    // Generate JWT
    const token = jwt.sign({
        id, email
    }, process.env.JWT_KEY, { expiresIn: '1h' });

      // Store it on session object
      req.session = {
        jwt: token
    }

      res.cookie('jwt', token, {
        expires: new Date(Date.now() + (60 * 60 * 1000)),
        httpOnly: true, // This will ensure the cookie can not be modified or access in any way by the browser
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https' // This will make sure the cookie is send only on encrypted connection (https)
      });
  
      return token;
}

module.exports = {createAndSendToken};