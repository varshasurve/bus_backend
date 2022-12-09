const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'bus booking'
});

connection.connect((error) => {
    if(error){
        console.log(error);
    }else{
        console.log("Connected to database");
    }
});

app.get('/', (req, res)=> {
    res.send('hello');
  });

//get all bus info
app.get('/get_all_bus_info' , (req, res) =>{
    const query = "SELECT * FROM bus"
    connection.query(query, (err, result) => { 
        if(err){
            res.status(500).send({
                success:false,
                msg: "Server error",
                data: []
            });
        }else
        {
            res.status(200).send(
                {
                    success:true,
                    msg: "show",
                    data: result
                }
                );
        }
    }); 
});

//get all passenger info
app.get('/get_all_passenger' , (req, res) =>{
    const query = "SELECT * FROM passenger"
    connection.query(query, (err, result) => { 
        if(err){
            res.status(500).send({
                success:false,
                msg: "Server error",
                data: []
            });
        }else
        {
            res.status(200).send(
                {
                    success:true,
                    msg: "show",
                    data: result
                }
                );
        }
    }); 
});

//show single passenger info by passenger id
app.get('/get_single_passenger_by_id/:p_id', (req ,res) =>
{
    const p_id = req.params.p_id;
    const query = "SELECT * FROM passenger WHERE p_id = ? " ;
    connection.query(query,[p_id],(err, result) => {
        if(err){
            res.status(500).send({
                success:false,
                msg: err,
                data: []
            });
        }else
        {
            res.status(200).send(
                {
                    success:true,
                    msg: "show",
                    data: result
                }
                );
        }
    })

});

//get passenger info by bus id
app.get('/get_passenger_by_bus_id/:bus_id', (req ,res) =>
{
    const bus_id = req.params.bus_id;
    const query = "SELECT * FROM passenger WHERE bus_id = ? " ;
    // const query = "SELECT students.*, std.* FROM students,std WHERE students.std_id = ? AND students.std_id = std.std_id" ;
    connection.query(query,[bus_id],(err, result) => {
        if(err){
            res.status(500).send({
                success:false,
                msg: err,
                data: []
            });
        }else
        {
            res.status(200).send(
                {
                    success:true,
                    msg: "show",
                    data: result
                }
                );
        }
    })

});

//add new passenger entry
app.post('/add_passenger' , (req, res) => {
    const p_name =req.body.p_name;
    const bus_id = req.body.bus_id;
    const location = req.body.location;
    const payment_mod = req.body.payment_mod;
    const query = "INSERT INTO passenger (p_name, bus_id, location,payment_mod)  VALUES (?,?,?,?)";
    connection.query(query, [p_name,bus_id,location,payment_mod],(err, result) => { 
        if(err){
            res.status(500).send({
                success:false,
                msg: "Server error",
                data: []
            });
        }else
        {
                res.status(200).send(
                {
                    success:true,
                    msg: "Successfully Added",
                    data: result.insertId
                }
                );
        }
        });
    });
//     check_bus_status(bus_id, (status) => {
//         if (status) {
//             const query = "INSERT INTO passenger (p_id, p_name, bus_id, location, payment_mod) VALUES (NULL, ?, ?, ?, ?)";
//             connection.query(query, [p_name, bus_id,location, payment_mod], (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send({
//                         success: false,
//                         msg: 'Server error',
//                         data: []
//                     })
//                 } else {
//                     get_passenger_count(bus_id, (count) => {
//                         console.log(count);
//                         if (count >= 4) {
//                             passenger_toggle(bus_id, 0, (update) => {
//                                 console.log(update);
//                                 res.status(200).send({
//                                     success: true,
//                                     msg: 'Success',
//                                     data: result
//                                 });
//                             })
//                         } else {
//                             passenger_toggle(bus_id, 1, (update) => {
//                                 res.status(200).send({
//                                     success: true,
//                                     msg: 'Success',
//                                     data: result
//                                 });
//                             })
//                         }
//                     })


//                 }
//             })
//         } else {
//             res.status(500).send({
//                 success: false,
//                 msg: 'Booking Closed',
//                 data: []
//             })
//         }
//     })
// });

app.put('/update_passenger/:p_id', (req, res) => {
    const p_id = req.params.p_id;
    const p_name =req.body.p_name;
    const bus_id = req.body.bus_id;
    const location = req.body.location;
    const payment_mod= req.body.payment_mod
    const query = "UPDATE passenger SET p_name = ?, bus_id = ?, location = ?,payment_mod = ? WHERE p_id = ?" ;
    connection.query(query, [ p_name,bus_id,location,payment_mod,p_id], (err, result) => { 
        if(err){
            res.status(500).send({
                success:false,
                msg: err,
                data: []
            });
        }else
        {
            res.status(200).send(
                {
                    success:true,
                    msg: "Successfully updated",
                    data: result.affectedRow
                }
                );
        }
        });
});

app.delete('/remove/:p_id', (req, res) => {
    const p_id = req.params.p_id;
    const query = "DELETE FROM passenger WHERE p_id = ?";
      connection.query(query, [p_id],(err, result) => { 
        if(err){
            res.status(500).send({
                success:false,
                msg: "Server error",
                data: []
            });
        }else
        {
            res.status(200).send(
                {
                    success:true,
                    msg: "Successfully deleted",
                    data: result
                }
                );
        }
      });
  });

  function passenger_toggle(bus_id, status, callback) {
    const query = "UPDATE `bus` SET `status` =  ? WHERE `bus`.`bus_id` = ?";
    connection.query(query, [status, bus_id], (err, result) => {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

function check_bus_status(bus_id, callback) {
    const query = "SELECT bus.status FROM bus WHERE bus_id = ?";
    connection.query(query, [bus_id], (err, result) => {
        if (err || result.length == 0 || result[0].status == 0) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

function get_passenger_count(bus_id, callback) {
    const query = "SELECT COUNT(p_id) as count FROM passenger WHERE bus_id = ?";
    connection.query(query, bus_id, (err, result) => {
        callback(result[0].count);
    })
}
app.listen(2525);