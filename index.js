const express = require('express');
const app = express();
const PORT = 5000;
const pool = require('./db');

app.use(express.json());

//Get transactions from certain date.
app.get('/transactions', async (req,res) => {
    date = req.body.date;
    const transactions = await pool.query("SELECT * FROM transactions WHERE date = $1",[date]);
    res.json(transactions.rows);
});

//Input valid transactions.
app.post('/transactions', async (req,res) => {
    try {
        date = req.body.date;
        transactions = req.body.transactions;
        let total = 0;
        for (const transaction of transactions) {
            if (transaction.amount < 0) {
                throw new RangeError("Invalid amount of money.");
            }
            if (transaction.type === "debt") {
                total += transaction.amount;
            } else if (transaction.type === "credit") {
                total -= transaction.amount;
            } else {
                throw new TypeError("Invalid transaction type.");
            }
        }
        if (total === 0) {
            for (const transaction of transactions) {
                await pool.query("INSERT INTO transactions(date,name,type,amount) VALUES($1,$2,$3,$4)",[date,transaction.name,transaction.type,transaction.amount]);
            }
        } else {
            throw new EvalError("All the debts and credits do not sum up to zero.");
        }
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(PORT,()=>console.log('Listening to port %d.',PORT));