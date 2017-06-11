const crypto = require('crypto');
const csprng = require('csprng');

const options = {
    saltbits: 160,
    iterations: 64000,
    keylength: 512,
    digest: 'sha512',
    encoding: 'base64'
};

module.exports = {
    createSalt: () => {
        return csprng(options.saltbits, 36);
    },

    createHash: (password, salt, callback) => {
        crypto.pbkdf2(
            Buffer.from(password),
            salt,
            options.iterations,
            options.keylength,
            options.digest,
            (err, key) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, key.toString(options.encoding));
                }
            }
        );
    },

    createHashSync: (password, salt) => {
        return crypto.pbkdf2Sync(
            Buffer.from(password),
            salt,
            options.iterations,
            options.keylength,
            options.digest
        ).toString(options.encoding);
    }
};
