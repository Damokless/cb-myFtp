const net = require('net')
const fs = require('fs')
const accounts = require('./accounts.json')
const func = require('./functions')
let statut = ''

const server = net.createServer((socket) => {
    console.log('new connection')

    socket.on('data', (data) => {
        const [command, arg] = data.toString().split(' ')
        console.log(command)
        console.log(arg)

        switch (command) {
            case 'HELP':
                socket.write('USER <username>: check if the user exist \n PASS <password>: authenticate the user with a password \n LIST: list the current directory of the server \n CWD <directory>: change the current directory of the server \n RETR <filename>: transfer a copy of the file FILE from the server to the client \n STOR <filename>: transfer a copy of the file FILE from the client to the server \n PWD: display the name of the current directory of the server \n HELP: send helpful information to the client \n QUIT: close the connection and stop the program')
                break;
            case 'USER':
                func.USER(arg)
                break;
            default:
                socket.write(`Command ${command} doesn't exist.`)
        }
    })
    socket.write('Hello from server')
})

if (process.argv[2] === undefined) {
    process.exit();
} else {
    server.listen(process.argv[2], () => {
        console.log(`Server launched on port : ${process.argv[2]}`)
    })
}