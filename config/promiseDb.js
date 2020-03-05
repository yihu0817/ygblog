const query = require('../config/db');

const queryDB = (sql,params) => {
    return  new Promise((resolve,rejectd) =>{
     query(sql,params, (err,data) => {
       if(err){
         rejectd(err);
       }else{
         resolve(data);
       }
    });
   })
 }

 module.exports = queryDB;