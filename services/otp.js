var speakeasy = require('speakeasy')

const generateOtp =  (otpSecret) =>{
    // Generate a time-based token based on the base-32 key.
    // HOTP (counter-based tokens) can also be used if `totp` is replaced by
    // `hotp` (i.e. speakeasy.hotp()) and a `counter` is given in the options.
    var token = speakeasy.totp({
      secret:otpSecret,
      encoding: 'base32'
    });

    return token;
}

const generateKey =  async( ) => {
    // Generate a secret key.
    var secret = speakeasy.generateSecret({length: 20}).base32;
 // Access using secret.ascii, secret.hex, or secret.base32.
    var otp = await generateOtp(secret)

    return {otp , secret}; 
}


module.exports = {
    generateKey
}