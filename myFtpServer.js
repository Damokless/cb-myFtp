const net = require('net')
const process = require('process')
const path = require('path')
const accounts = require('./accounts.json')
const fs = require('fs')
let userstatut = false
let statut = false
let id = ''
let defaultpath = process.cwd()
let defaultfolder = path.basename(process.cwd())

const server = net.createServer((socket) => {
    console.log('new connection')

    socket.on('data', (data) => {
        const [command, arg] = data.toString().split(' ')
        switch (command) {
            case 'HELP':
                socket.write('USER <username>: check if the user exist \n PASS <password>: authenticate the user with a password \n LIST: list the current directory of the server \n CWD <directory>: change the current directory of the server \n RETR <filename>: transfer a copy of the file FILE from the server to the client \n STOR <filename>: transfer a copy of the file FILE from the client to the server \n PWD: display the name of the current directory of the server \n HELP: send helpful information to the client \n QUIT: close the connection and stop the program')
                break;
            case 'USER':
                for (let i = 0; i < accounts.users.length; i++)
                    if (arg == accounts.users[i].username) {
                        userstatut = true
                        id = i
                        i = accounts.users.length
                        socket.write('Successful user identification, use the PASS command to enter the password')
                    } else if (accounts.users[i].username != arg) {
                        console.log('Scanning database ...')
                    } else {
                        i = accounts.users.length
                        socket.write('Username does not exist, try again')
                    }
                break;
            case 'PASS':
                if (userstatut == false) {
                    socket.write('You must first authenticate yourself with the command USER')
                } else {
                    if (arg == accounts.users[id].password) {
                        statut = true
                        socket.write('Successful identification, you can now use the following command : LIST, PWD, CWD, RETR, STOR')
                    } else {
                        socket.write('Wrong password, try again')
                    }
                }
                break;
            case 'PWD':
                if (statut == true) {
                    socket.write(process.cwd())
                } else {
                    socket.write('You must first authenticate yourself with the command USER')
                }
                break;
            case 'CWD':
                if (statut == true) {
                    process.chdir(arg)
                    newpath = process.cwd().split(path.sep)
                    pathid = newpath.indexOf(defaultfolder).toString()
                    if (pathid == '-1') {
                        socket.write('You are unable to access')
                        process.chdir(defaultpath)
                    } else if (pathid != '-1') {
                        socket.write(' ')
                    }
                } else {
                    socket.write('You must first authenticate yourself with the command USER')
                }
                break;
            case 'LIST':
                if (statut == true) {
                    fs.readdir(process.cwd(), (err, files) => {
                        if (err) {
                            console.log('error')
                        } else if (files.length == 0) {
                            socket.write('No such file or directory')
                        } else {
                            socket.write(files.join('   '))
                        }
                    })
                } else {
                    socket.write('You must first authenticate yourself with the command USER')
                }
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