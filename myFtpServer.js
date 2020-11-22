const net = require('net')
const process = require('process')
const path = require('path')
const accounts = require('./accounts.json')
const fs = require('fs')

const server = net.createServer((socket) => {
    console.log('new connection')
    let userstatut = false
    let statut = false
    let id = '-1'
    let defaultpath = process.cwd()
    let defaultfolder = path.basename(process.cwd())

    socket.on('data', (data) => {
        const [command, arg,] = data.toString().split(' ')
        data = data.toString().slice(command.length + 1)
        if (arg != undefined){
        data = data.toString().slice(arg.length + 1)
        }
        let datafile = data.toString()
        switch (command) {
            case 'HELP':
                console.log('214 : Help message.On how to use the server or the meaning of a particular non-standard command. This reply is useful only to the human user.')
                socket.write('USER <username>: check if the user exist \n PASS <password>: authenticate the user with a password \n LIST: list the current directory of the server \n CWD <directory>: change the current directory of the server \n RETR <filename>: transfer a copy of the file FILE from the server to the client \n STOR <filename>: transfer a copy of the file FILE from the client to the server \n PWD: display the name of the current directory of the server \n HELP: send helpful information to the client \n QUIT: close the connection and stop the program')
                break;
            case 'USER':
                for (i = 0; i < accounts.users.length; i++)
                    if (arg == accounts.users[i].username) {
                        userstatut = true
                        id = i
                        i = accounts.users.length
                        console.log('331 : User name okay, need password.')
                        socket.write('Successful user identification, use the PASS command to enter the password')
                    } else if (accounts.users[i].username != arg) {
                        console.log('Scanning database ...')
                    } else {
                        i = accounts.users.length
                        console.log('430 : Invalid username or password')
                        socket.write('Username does not exist, try again')
                    }
                if (id == '-1') {
                    socket.write('The user is not in the database')
                }
                break;
            case 'PASS':
                if (userstatut == false) {
                    console.log('332 : Need account for login.')
                    socket.write('You must first authenticate yourself with the command USER')
                } else {
                    if (arg == accounts.users[id].password) {
                        statut = true
                        console.log('230 User logged in, proceed. Logged out if appropriate.')
                        socket.write('Successful identification, you can now use the following command : LIST, PWD, CWD, RETR, STOR')
                    } else {
                        console.log('430 : Invalid username or password')
                        socket.write('Wrong password, try again')
                    }
                }
                break;
            case 'PWD':
                if (statut == true) {
                    socket.write(process.cwd())
                } else {
                    console.log('332 : Need account for login.')
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
                    console.log('332 : Need account for login.')
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
                            console.log('10066 : Directory not empty.')
                            socket.write(files.join('   '))
                        }
                    })
                } else {
                    console.log('332 : Need account for login.')
                    socket.write('You must first authenticate yourself with the command USER')
                }
                break;
            case 'STOR':
                if (statut == true) {
                    fs.writeFile(arg, datafile, (err) => {
                        if (err) {
                            console.log('error')
                        } else {
                            socket.write('File transferred')
                        }
                    })
                } else {
                    console.log('332 : Need account for login.')
                    socket.write('You must first authenticate yourself with the command USER')
                }
                break;
            case 'QUIT':
                console.log(`221 : Service closing control connection for id : ${id}`)
                break;
            default:
                console('202 : Command not implemented, superfluous at this site.')
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