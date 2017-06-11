#!/usr/bin/env node

/* eslint-disable unicorn/no-process-exit */

const fs = require('fs');
const readlineSync = require('readline-sync');
const options = require('yargs')
    .usage(`usage $0 [-c | -t | -D] passwordfile username
      $0 -b [-c | -t] passwordfile username password`)
    .boolean('c')
    .boolean('b')
    .boolean('t')
    .boolean('D')
    .alias('c', 'create')
    .alias('b', 'batch')
    .alias('t', 'test')
    .alias('D', 'delete')
    .describe('c', 'create a new password file. This will overwrite existing files.')
    .describe('b', 'run in batch mode to allow passing passwords on the command line.')
    .describe('D', 'delete the username rather than adding/updating its password.')
    .describe('t', 'test mode. verify a users password.')
    .demandCommand(2)
    .version()
    .help('help')
    .argv;

if (options.create && options.delete) {
    console.error('Error: Options create and delete are mutually exclusive.');
    process.exit(1);
} else if (options.create && options.test) {
    console.error('Error: Options create and test are mutually exclusive.');
    process.exit(1);
} else if (options.delete && options.test) {
    console.error('Error: Options delete and test are mutually exclusive.');
    process.exit(1);
} else if (options.delete && options.batch) {
    console.error('Error: Options delete and batch are mutually exclusive.');
    process.exit(1);
}

let [passwordfile, username, password] = options._;
let passwords;

const crypto = require('./crypto.js');

function readFileSync(file) {
    return JSON.parse(fs.readFileSync(file).toString());
}

function writeFileSync(file, passwords) {
    fs.writeFileSync(file, JSON.stringify(passwords));
}

/* istanbul ignore next */
function readPasswordSync() {
    const password1 = readlineSync.question('Password: ', {
        hideEchoBack: true,
        mask: ''
    });
    if (!options.test) {
        const password2 = readlineSync.question('Reenter password: ', {
            hideEchoBack: true,
            mask: ''
        });
        if (password1 !== password2) {
            console.error('Error: Passwords do not match.');
            process.exit(1);
        }
    }
    password = password1;
}

function testPassword() {
    if (!passwords[username]) {
        console.error(`Error: User ${username} unknown.`);
        process.exit(1);
    } else if (passwords[username].hash === crypto.createHashSync(password, passwords[username].salt)) {
        console.log('Password correct.');
        process.exit(0);
    } else {
        console.error('Error: Password mismatch.');
        process.exit(1);
    }
}

function setPassword() {
    const isNew = !passwords[username];
    const salt = crypto.createSalt();
    const hash = crypto.createHashSync(password, salt);
    if (isNew) {
        passwords[username] = {salt, hash};
    } else {
        passwords[username].salt = salt;
        passwords[username].hash = hash;
    }
    writeFileSync(passwordfile, passwords);
    console.log(`User ${username} ${isNew ? 'created' : 'updated'}.`);
    process.exit(0);
}

if (options.create) {
    passwords = {};
} else {
    passwords = readFileSync(passwordfile);
}

if (options.delete) {
    if (!passwords[username]) {
        console.error(`Error: User ${username} unknown.`);
        process.exit(1);
    }
    delete passwords[username];
    writeFileSync(passwordfile, passwords);
    console.log(`User ${username} deleted.`);
    process.exit(0);
} else {
    /* istanbul ignore next */
    if (!options.batch) {
        readPasswordSync();
    }
    if (options.test) {
        testPassword();
    } else {
        setPassword();
    }
}
