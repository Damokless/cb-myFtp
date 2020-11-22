# 📋 Description

Project created in node.js with :

- net
- readlines
- process
- path
- fs

The goal was to create an ftp server with a client. The client should be able to send commands to the server.

# 📥 Installation

1) Download or clone the git
2) Unzip the file

# 👨‍💻 Usage

#### Here is the command to launch the server

```nodejs
node .\myFtpServer.js 21
```
#### Here is the command to launch the client(s)

```nodejs
node .\myFtpClient.js localhost 21
```

#### To login to the FTP server you can use the usernames and passwords in the .json file

# ⌨️ Commands

- USER [username] : check if the user exist
- PASS [password] : authenticate the user with a password
- LIST : list the current directory of the server
- CWD [directory] : change the current directory of the server
- RETR [filename] : transfer a copy of the file FILE from the server to the client
- STOR [filename] : transfer a copy of the file FILE from the client to the server
- PWD: display the name of the current directory of the server
- HELP: send helpful information to the client
- QUIT: close the connection and stop the program
