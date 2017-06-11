const fs = require('fs');
const crypto = require('./crypto.js');

function Passwd(passwordfile) {
    if (!(this instanceof Passwd)) {
        return new Passwd(passwordfile);
    }

    this.passwordfile = passwordfile;

    this.verify = (user, password, callback) => {
        fs.readFile(this.passwordfile, (err, data) => {
            if (err) {
                callback(err);
            } else {
                let passwords;
                try {
                    passwords = JSON.parse(data.toString());
                } catch (err) {
                    callback(err);
                    return;
                }
                this.checkPasswd(passwords, user, password, callback);
            }
        });
    };

    this.checkPasswd = (passwords, user, password, callback) => {
        if (passwords[user]) {
            crypto.createHash(password, passwords[user].salt, (err, hash) => {
                if (err) {
                    callback(err);
                } else if (hash === passwords[user].hash) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            });
        } else {
            callback(new Error('user unknown'));
        }
    };
}

module.exports = Passwd;
