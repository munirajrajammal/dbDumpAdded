const mysql = require('mysql');
var moment = require('moment');

//  database connection


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
  getData().then((res) => {
    insertData(res)
  })
});

// insert db data
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

// get data function
function getData() {
  console.log('----- inside of select data -----');
  return new Promise((resolve, reject) => {
    getExpenditure = 'select * from expenditures';
    ourDb.query(getExpenditure, (err, result) => {
      if (err) {
        console.log('@@@ error of select db data @@@@', err)
        reject(err)
      } else {
        var getExpenditureData = result.map((data) => {
          var year = `${data.Year}`
          var month = `${data.Month}`
          var myDate = new Date(`${year.trim()}-${month.trim()}-01 14:24:36`);
          var datefor = moment(myDate).format("YYYY-MM-DD HH:mm:ss")
          return {
            amount: data['Amt'],
            comment: data['Comments'],
            date: datefor
          }
        })
        resolve(getExpenditureData)
        console.log('----- data of -----', getExpenditureData.length)
        ourDb.end();
      }
    })
  })
}

// insert function data
function insertData(res) {
  console.log('ggggggggggggggg ========================', res.length)
  res.map((i) => {
    // return new Promise((resolve, reject) => {
    insertQuery = 'insert into expenditure (comment , amount , date) values (?,?,?)';
    myDb.query(insertQuery, [i['comment'], i['amount'], i['date']], (err) => {
      if (err) {
        console.log('----- error------')
      } else {
        console.log('------ result success-------')
      }
    })
    // })
  })
  myDb.end();
}