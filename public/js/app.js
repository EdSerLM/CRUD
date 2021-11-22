
// Referencias de jQuery
var addSection = $('#add');
var addButton = $('#button-add')
var addButtonNumber = $('#button-add-number')
var newValue = $('#newValue')
var newNumber = $('#newValue-Number')
var editValue = $('#editValue')
var table = $('#table')
var editModal = $('#exampleModal')
var editButton = $('#button-edit')

$(document).ready(function () {
   
    table.DataTable({
        "columns": JSON.parse('[{ "data": "ID"}, {"data": "DataVal" }, {"data": "DataType" }, { "data": "Row"}]'),
        "autoWidth": true, "searching": false, "paging": true, "ordering": false, "info": false,
        "ajax": {
            url: '/api',
            method: "GET",
            async: true,
            "dataSrc": function (json) { return readJsonForDataTables(json) }
        },"columnDefs": [            
            {
                targets: 3, render: function (data, type, row, meta) {                   
                    return '<a type="button" class="btn btn-small btn-success" href="javascript:ShowEditModal('+ row.Row +')">Editar</a> <a type="button" class="btn btn-small btn-danger" href="javascript:DeleteRow('+ row.ID +')">Eliminar</a>';
                }
            }
        ]
    });
})

// Agregar un registro (string)
addButton.on('click', function() {
    var mensaje = newValue.val();
    if (mensaje.length === 0) {
        alert('1 caracter como minimo')
        newValue.removeClass( "is-valid" ).addClass( "is-invalid")
        return;
    }
    if(mensaje.length >= 25){
        alert('25 caracter como maximo')
        newValue.removeClass( "is-valid" ).addClass( "is-invalid")
        return;
    }

    var data = {
        DataVal: mensaje,
        DataType: 'string'       
    };
    fetch('api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            newValue.removeClass( "is-invalid" ).addClass( "is-valid")
            newValue.val('')
            table.DataTable().ajax.reload()
        })
        .catch(err => console.log('app.js error:', err));  
});

// Agregar un registro (number)
addButtonNumber.on('click', function() {
    
    if (newNumber.val().length === 0) {
        alert('Debe ingresar un numero valido')
        newNumber.removeClass( "is-valid" ).addClass( "is-invalid")
        return;
    }
    var dataVal = Number(newNumber.val());
  
    if(Math.sign(dataVal) === -1){
        alert('El numero debe ser positivo')
        newNumber.removeClass( "is-valid" ).addClass( "is-invalid")
        return;
    }

    var data = {
        DataVal: dataVal,
        DataType: esEntero(dataVal)    
    };
    fetch('api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            newNumber.removeClass( "is-invalid" ).addClass( "is-valid")
            newNumber.val('')
            table.DataTable().ajax.reload()
        })
        .catch(err => console.log('app.js error:', err));  
});

// Editar un registro
editButton.on('click', function() {
    var data;
    switch(editValue.attr('data-type'))
    {
        case 'string':{
            var mensaje = editValue.val();
            if (mensaje.length === 0) {
                alert('1 caracter como minimo')
                editValue.removeClass( "is-valid" ).addClass( "is-invalid")
                return;
            }
            if(mensaje.length >= 25){
                alert('25 caracter como maximo')
                editValue.removeClass( "is-valid" ).addClass( "is-invalid")
                return;
            }
            data = {
                DataVal: mensaje,
                DataType: 'string'
            };
            break;
        }
        default:{
            if (editValue.val().length === 0) {
                alert('Debe ingresar un numero valido')
                editValue.removeClass( "is-valid" ).addClass( "is-invalid")
                return;
            }
            dataVal = Number(editValue.val());
          
            if(Math.sign(dataVal) === -1){
                alert('El numero debe ser positivo')
                newNumber.removeClass( "is-valid" ).addClass( "is-invalid")
                return;
            }
        
            data = {
                DataVal: dataVal,
                DataType: esEntero(dataVal)    
            };
        }
    }
    fetch('api', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            newNumber.removeClass( "is-invalid" ).addClass( "is-valid")
            newNumber.val('')
            table.DataTable().ajax.reload()
        })
        .catch(err => console.log('app.js error:', err));  
});

// Borrar un registro
function DeleteRow(id){    
    var data = {
        row_id: id
    };
    
    fetch('api', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => console.log('app.js', res))
        .catch(err => console.log('app.js error:', err));  
}

//Abrir Modal
function ShowEditModal(id){
    var rowData = table.DataTable().rows(id).data().toArray()[0];
    var data = {
        DataVal: rowData.DataVal,
        DataType: rowData.DataType        
    };
    editValue.val(rowData.DataVal);
    editValue.attr('data-type', rowData.DataType);
    editModal.show()
}

//Cerrar Modal
function CloseEditModal(){
    editModal.hide()
}

function readJsonForDataTables(json) {
	for (var i = 0, ien = json.length; i < ien; i++) {
		json[i][0] = '<a href="/message/' + json[i][0] + '>View message</a>';
	}
	return json;
}

//Validar entero o decimal
function esEntero(numero){
    if (numero % 1 == 0) {
        return 'integer'
    } else {
        return 'float'
    }
}