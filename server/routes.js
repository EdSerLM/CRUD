const { response } = require('express');
var express = require('express');
var router = express.Router();
const pool = require('./dbContext');

// Get valores
router.get('/', function (req, res) {
  pool.query('SELECT * FROM ExampleValues', (error,result) => {
    if(error) throw error;
    var values = [];
    var row = 0;
    result.forEach(element => {
      values.push({ID: element.id, DataVal: element.DataVal, DataType: element.DataType, Row: row})
      row++;
    });    
    res.json(values);
  })
});

// Post valores
router.post('/', function (req, res) {
  pool.query('INSERT INTO ExampleValues SET ?', req.body, (error,result) => {
    if(error) throw error;
    res.json({ok: true, result});
  })
})

// Put valores
router.put('/:row_id', function (req, res) {
  const id = req.params.row_id;
  console.log(id)
  pool.query('UPDATE ExampleValues SET ? WHERE id = ?', [req.body, id], (error,result) => {
    if(error) throw error;
    res.json({ok: true, result});
  })
})

// Delete valores
router.delete('/:row_id', function (req, res) {
  const id = req.params.row_id;
  console.log(req)
  pool.query('DELETE FROM ExampleValues WHERE id = ?', id, (error,result) => {
    if(error) throw error;
    res.json({ok: true, result});
  })
})

module.exports = router;