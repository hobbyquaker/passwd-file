const should = require('should');

const fs = require('fs');
const cp = require('child_process');
const pty = require('pty.js');

const folderName = 'testfiles-' + (Math.random() * 65536).toString(16).slice(5);

fs.mkdir(folderName);

fs.writeFileSync(__dirname + '/' + folderName + '/invalid_json', '}INVALID_JSON]');

describe('command line interface - batch mode', function () {
    this.timeout(180000);
    it('should create a new password file in batch mode', function (done) {
        cp.exec('./cli.js -b -c ./' + folderName + '/test-pwfile-1 testuser1 testpw1', (err, stdout, stderr) => {
            if (!err && stdout === 'User testuser1 created.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should verify a password in batch mode', function (done) {
        cp.exec('./cli.js -b -t ./' + folderName + '/test-pwfile-1 testuser1 testpw1', (err, stdout, stderr) => {
            if (!err && stdout === 'Password correct.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should change a correct password in batch mode', function (done) {
        cp.exec('./cli.js -b ./' + folderName + '/test-pwfile-1 testuser1 testpw2', (err, stdout, stderr) => {
            if (!err && stdout === 'User testuser1 updated.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should not verify a wrong password in batch mode', function (done) {
        cp.exec('./cli.js -b -t ./' + folderName + '/test-pwfile-1 testuser1 testpw1', (err, stdout, stderr) => {
            if (err && stderr === 'Error: Password mismatch.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should verify a correct password in batch mode', function (done) {
        cp.exec('./cli.js -b -t ./' + folderName + '/test-pwfile-1 testuser1 testpw2', (err, stdout, stderr) => {
            if (!err && stdout === 'Password correct.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should add a user in batch mode', function (done) {
        cp.exec('./cli.js -b ./' + folderName + '/test-pwfile-1 testuser2 testpw3', (err, stdout, stderr) => {
            if (!err && stdout === 'User testuser2 created.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should verify a correct password in batch mode', function (done) {
        cp.exec('./cli.js -b -t ./' + folderName + '/test-pwfile-1 testuser2 testpw3', (err, stdout, stderr) => {
            if (!err && stdout === 'Password correct.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should output an error for a unknown user in test batch mode', function (done) {
        cp.exec('./cli.js -b -t ./' + folderName + '/test-pwfile-1 unknown-user testpw3', (err, stdout, stderr) => {
            if (err && stderr === 'Error: User unknown-user unknown.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should output an error on missing password file in batch mode', function (done) {
        cp.exec('./cli.js -b ./' + folderName + '/test-pwfile-3 testuser2 testpw3', (err, stdout, stderr) => {
            if (err && stderr.indexOf('Error: ENOENT: no such file or directory') !== -1) {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should output an error on invalid password file in batch test mode', function (done) {
        cp.exec('./cli.js -b -t ./' + folderName + '/invalid_json testuser2 testpw3', (err, stdout, stderr) => {
            if (err && stderr.indexOf('SyntaxError: Unexpected token } in JSON at position 0') !== -1) {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should output an error on missing password file in batch test mode', function (done) {
        cp.exec('./cli.js -b -t ./' + folderName + '/test-pwfile-3 testuser2 testpw3', (err, stdout, stderr) => {
            if (err && stderr.indexOf('Error: ENOENT: no such file or directory') !== -1) {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });

});

describe('command line interface', function () {
    this.timeout(60000);
    it('should delete a user ', function (done) {
        cp.exec('./cli.js -D ./' + folderName + '/test-pwfile-1 testuser2', (err, stdout, stderr) => {
            if (!err && stdout === 'User testuser2 deleted.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should output an error for a unknown user on deletion', function (done) {
        cp.exec('./cli.js -D ./' + folderName + '/test-pwfile-1 unknown-user', (err, stdout, stderr) => {
            if (err && stderr === 'Error: User unknown-user unknown.\n') {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should output an error on missing password file on deletion', function (done) {
        cp.exec('./cli.js -D ./' + folderName + '/test-pwfile-3 testuser2', (err, stdout, stderr) => {
            if (err && stderr.indexOf('Error: ENOENT: no such file or directory') !== -1) {
                done();
            } else {
                done(err || new Error(stdout + '\n\n' + stderr));
            }
        });
    });
    it('should create a new password file', function (done) {
        const cli = pty.spawn('./cli.js', ['-c', __dirname + '/' + folderName + '/test-pwfile-4', 'testuser1'], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: __dirname,
            env: process.env
        });
        cli.on('data', data => {
            data = data.toString();
            //console.log(JSON.stringify({data: data}));
            if (data === 'Password: ') {
                cli.write('testpw1\n');
            } else if (data === 'Reenter password: ') {
                cli.write('testpw1\n');
            } else if (data === 'User testuser1 created.\r\n') {
                done();
            }
        });
    });
    it('should verify a correct password', function (done) {
        const cli = pty.spawn('./cli.js', ['-t', __dirname + '/' + folderName + '/test-pwfile-4', 'testuser1'], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: __dirname,
            env: process.env
        });
        cli.on('data', data => {
            data = data.toString();
            //console.log(JSON.stringify({data: data}));
            if (data === 'Password: ') {
                cli.write('testpw1\n');
            } else if (data === 'Password correct.\r\n') {
                done();
            }
        });
    });
    it('should not verify a wrong password', function (done) {
        const cli = pty.spawn('./cli.js', ['-t', __dirname + '/' + folderName + '/test-pwfile-4', 'testuser1'], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: __dirname,
            env: process.env
        });
        cli.on('data', data => {
            data = data.toString();
            //console.log(JSON.stringify({data: data}));
            if (data === 'Password: ') {
                cli.write('testpw2\n');
            } else if (data === 'Error: Password mismatch.\r\n') {
                done();
            }
        });
    });
    it('should output an error on update with mismatching password entry', function (done) {
        const cli = pty.spawn('./cli.js', ['-c', __dirname + '/' + folderName + '/test-pwfile-4', 'testuser1'], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: __dirname,
            env: process.env
        });
        cli.on('data', data => {
            data = data.toString();
            if (data === 'Password: ') {
                cli.write('testpw2\n');
            } else if (data === 'Reenter password: ') {
                cli.write('testpw3\n');
            } else if (data === 'Error: Passwords do not match.\r\n') {
                done();
            }
        });
    });
    it('should update a password', function (done) {
        const cli = pty.spawn('./cli.js', ['-c', __dirname + '/' + folderName + '/test-pwfile-4', 'testuser1'], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: __dirname,
            env: process.env
        });
        cli.on('data', data => {
            data = data.toString();
            //console.log(JSON.stringify({data: data}));
            if (data === 'Password: ') {
                cli.write('testpw2\n');
            } else if (data === 'Reenter password: ') {
                cli.write('testpw2\n');
            } else if (data === 'User testuser1 created.\r\n') {
                done();
            }
        });
    });
    it('should verify a correct password', function (done) {
        const cli = pty.spawn('./cli.js', ['-t', __dirname + '/' + folderName + '/test-pwfile-4', 'testuser1'], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: __dirname,
            env: process.env
        });
        cli.on('data', data => {
            data = data.toString();
            //console.log(JSON.stringify({data: data}));
            if (data === 'Password: ') {
                cli.write('testpw2\n');
            } else if (data === 'Password correct.\r\n') {
                done();
            }
        });
    });
});

describe('lib usage', function () {
    this.timeout(60000);
    let lib;
    let lib_missingfile;
    let lib_invalidjson;
    it('should instantiate without an error', function () {
        lib = require('./lib.js')(__dirname + '/' + folderName + '/test-pwfile-4');
    });
    it('should instantiate without an error', function () {
        lib_missingfile = require('./lib.js')(__dirname + '/' + folderName + '/missing_file');
    });
    it('should instantiate without an error', function () {
        lib_invalidjson = require('./lib.js')(__dirname + '/' + folderName + '/invalid_json');
    });
    it('should return an error when trying to verify with missing file', function (done) {
        lib_missingfile.verify('testuser1', 'wrong-password', (err, res) => {
            if (err && err.message.indexOf('ENOENT') === 0) {
                done();
            } else if (err) {
                done(err);
            } else {
                done(new Error());
            }
        });
    });
    it('should return an error when trying to verify with an invalid file', function (done) {
        lib_invalidjson.verify('testuser1', 'wrong-password', (err, res) => {
            if (err && err.message.indexOf('Unexpected token') === 0) {
                done();
            } else if (err) {
                done(err);
            } else {
                done(new Error());
            }
        });
    });
    it('should return an error when trying to verify an unknown user', function (done) {
        lib.verify('unknown-user', 'wrong-password', (err, res) => {
            if (err && err.message.indexOf('user unknown') === 0) {
                done();
            } else if (err) {
                done(err);
            } else {
                done(new Error());
            }
        });
    });
    it('should return false when trying to verify with wrong password', function (done) {
        lib.verify('testuser1', 'wrong-password', (err, res) => {
            if (!err && res === false) {
                done();
            } else if (err) {
                done(err);
            } else {
                done(new Error(res));
            }
        });
    });
    it('should return true when verifying with correct password', function (done) {
        lib.verify('testuser1', 'testpw2', (err, res) => {
            if (!err && res === true) {
                done();
            } else if (err) {
                done(err);
            } else {
                done(new Error(res));
            }
        });
    });
});
