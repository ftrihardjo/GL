const Pool = require('pg').Pool;
const pool = new Pool({
    user:"postgres",
    password:"FPziJgMmc8",
    database:"GL",
    host:"localhost",
    port:5432
});
module.exports = pool;