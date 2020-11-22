const fs = require('fs')
const net = require('net')
const client = new net.Socket()
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.connect(process.argv[3], process.argv[2], () => {

  console.log(`connected to ${process.argv[2]}:${process.argv[3]}`)

  client.on('data', (data) => {
    console.log(data.toString())

    rl.question('FTP >> ', (answer) => {
      let arg = answer.split(' ')
      switch (arg[0]) {

        case 'QUIT':
          rl.close();
          client.write(`${answer}`)
          console.log('you will be disconnected')
          client.destroy()
          break;

        case 'STOR':
          let data = fs.readFileSync(arg[1], { encoding: 'utf8', flag: 'r' })
          let myArray = [arg[0], arg[1], data]
              client.write(myArray.join(' '))
          break;

        default:
          client.write(`${answer}`)
      }
    })
  })
})