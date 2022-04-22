const Pool = require("pg").Pool;
const moment = require('moment');
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "testdb",
    password: "password",
    port: 5432
  });

function dbQuery(){
    this.query = async function({tokenType = null,date=null}){
        //console.log(tokenType)
        let subQuery1 = `select token, sum(amount) as total from transactions t where  transaction_type = 'DEPOSIT' group by "token"`
        let subQuery2 = `select token, sum(amount) as total from transactions t where  transaction_type = 'WITHDRAWAL' group by "token"`
        let query = `select a.token, a.total as addition, b.total as subtraction, a.total - b.total as diff from (${subQuery1}) a inner join (${subQuery2}) b on a.token = b.token`
        if(tokenType){
            query = query.concat(` where a.token='${tokenType}'`);
        }
        if(date){
            date = date.concat(" 23:59:59")
            // console.log(date);
            // console.log("DATE",moment(date,"YYYY-MM-DD HH:mm:ss").valueOf());
            date = moment(date,"YYYY-MM-DD HH:mm:ss").valueOf()/1000;
            subQuery1 = `select token, sum(amount) as total from transactions t where  transaction_type = 'DEPOSIT' and timestamp <= ${date} group by "token"`
            subQuery2 = `select token, sum(amount) as total from transactions t where  transaction_type = 'WITHDRAWAL' and timestamp <= ${date} group by "token"`
            query = `select a.token, a.total as addition, b.total as subtraction, a.total - b.total as diff from (${subQuery1}) a inner join (${subQuery2}) b on a.token = b.token`
            if(tokenType){
                query = query.concat(` where a.token='${tokenType}'`);
            }
        }   
        try {
            return await pool.query(query);
        }
        catch(err){
            return err;
        }
    }
    this.tokenList = async function(){
        let query = `select distinct token from transactions t`;

        try {
            return await pool.query(query);
        }
        catch(err){
            return err;
        }
    }
}

module.exports = new dbQuery();