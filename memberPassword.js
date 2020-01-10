const mysql = require('mysql');
var fs = require('fs');
const bcrypt = require("bcrypt");

// get db data
const ourDb = mysql.createConnection({
  host: 'localhost',
  user: 'swftrustcheckExpenditure',
  password: 'password',
  database: 'swftrustNews'
});
ourDb.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('==== connect of our db ====');
  getEmail().then((res) => {
    insertData(res)
  })
});

// insert member db data
const myDb = mysql.createConnection({
  host: 'localhost',
  user: 'swftrust',
  password: 'password',
  database: 'swf_trust'
});
myDb.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('**** connect of mydb ******');
});



function getEmail() {
  console.log('----- before check mysql ------')
  return new Promise((resolve, reject) => {
    getMember = 'select * from member';
    ourDb.query(getMember, (err, result) => {
      if (err) {
        console.log('@@@ error of select db data @@@@', err)
        reject(err)
      } else {
        console.log('----- query of data member ------', result.length)
        var stream = fs.createWriteStream("my_file.txt");
        var memberData = result.map((data) => {
          if (data['email'] === 'guest') {
            stream.write(` ======================== \n id : ${data['id']} , \n id_facebook : ${data['id_facebook']} , \n loginName : ${data['loginName']} , \n email : ${data['email']} , \n DOB : ${data['DOB']} , \n Per_mail : ${data['Per_mail']} , \n gender : ${data['gender']} , \n ${data['email']}\n`);
          } else {
            return {
              id: data['id'],
              email: data['email'],
              userName: data['loginName'],
              password: data['password']
            }
          }
        })
        resolve(memberData)
        ourDb.end();
      }
    })
  })
}

function insertData(res) {
  console.log('======', res.length)
  res.map((insertData) => {
    if (insertData === undefined) {
      console.log('eeeerrrrr')
    } else {
      var saltRounds = 12;
      bcrypt.hash(insertData['password'], saltRounds, function (err, hash) {
        console.log('@@@@@@', hash)
        var role = 'member';
        var source = 'admin';
        var isActive = 1;
        queryMember = 'INSERT INTO auth( userName , email , password , role , source , isActive ) VALUES ( ?,?,?,?,?,? )'
        myDb.query(queryMember, [insertData['userName'], insertData['email'], hash, role, source, isActive], (err) => {
          if (err) {
            console.log('====== error ====')
          } else {
            console.log('====== insert successfully ======')
          }
        });
      })
    }
  })
}