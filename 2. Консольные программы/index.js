let fileName = 'message.log';
const fs = require('fs');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout, 
    prompt: 'Head or Tail? 1 - Head, 2 - Tail, 0 - Exit\n',
});


function log(msg, line) {
    console.log(msg);
    let startDate = new Date().toLocaleString();
    let str = '\n' + startDate + ' > ' + msg 
        + (line != '' ? ' > ' + line: '');
    fs.appendFile(fileName, str, (err) => {if (err) throw err;});
}

function tossCoin() {
    let res = Math.round(Math.random(), 1) + 1;
    log('Toss coin...', res);
    return res;
}

function guess(toss) {

    rl.on('line', (line) => {
        if (line == toss) {
            log('...Win', line);
            rl.removeAllListeners();
            setTimeout(() => start(), 500);
        }
        else if (line == 0) {
            log('The End', line);
            rl.close();
        }
        else {
            log('...Fail', line);
        }
    });

    return;
}

function start() {

    log('******************************', '');
    let toss = tossCoin();
    rl.prompt();
    guess(toss);    

};

start(); 