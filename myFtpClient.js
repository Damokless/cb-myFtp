const net = require('net')
const client = new net.Socket()
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.connect(process.argv[3], process.argv[2], () => {

  console.log(`connected to ${process.argv[3]}:${process.argv[2]}`)

  client.on('data', (data) => {
    console.log(data.toString())

    rl.question('FTP >> ', (answer) => {
      client.write(`${answer}`)

      if (answer == 'QUIT') {
        rl.close();
        console.log('you will be disconnected')
        client.destroy()
      }
    })
  })
})