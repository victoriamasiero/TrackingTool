$(document).ready(function(){
    // Launch DataTable to make the table look nicer, if there is a table to display...
  if($('#available-data').length){
    
    // Modify Modal On Show
    $.isSuperADmin = $("#EditButton").length > 0
    $.selectedRow = undefined
    $.selectedRowDom = undefined
    $.internalIdSelection = undefined
    $('#Editor').on('show.bs.modal', function () {
      var calendar_button = $("#Calendar-button")
      $('[data-toggle="datepicker"]').datepicker({
        trigger: calendar_button,
        format: "dd/mm/yyyy",
        zIndex: 2048,
      }); 
      var row = $("#available-data tr.selected")
      $.selectedRow = row.closest('tr').index()
      $.selectedRowDom = row
      var table_header = []
      table.columns().every(function(){
        table_header.push(this.header().textContent)
      })
      var complete_data_table = _.zipObject(table_header, table.row(row).data())
      console.log(complete_data_table)
      var ctr = complete_data_table["CTR"].length > 0 ? true: false
      var tra = complete_data_table["TRA"]
      var v_status = complete_data_table["Validated Status"].length > 0 ? true: false
      var r_status = complete_data_table["Results Status"]
      var comment = complete_data_table["Commentary"]
      var delivery_date = complete_data_table["Delivery Date"]
      $.internalIdSelection = row.attr("id")
      var modal = $(this)
      modal.find('.modal-body #CTRCheck').prop('checked', ctr)
      modal.find(".modal-body #TRA-input").val(tra)
      modal.find('.modal-body #validatedCombo').val(r_status)
      modal.find('.modal-body #validatedCheck').prop('checked', v_status)
      modal.find('.modal-body #Delivery-Input').val(delivery_date)
      modal.find('.modal-body #Comment-input').val(comment)
    })
    $("#available-data td").click(function(ev){
      if($.isSuperADmin){
        ev.stopPropagation()
      $("#EditButton").removeAttr("disabled").removeClass("disabled")
      $(this).closest("tr").addClass('selected').siblings().removeClass('selected'); 
      return true
      }
    }) 

     //Disabled bc stéphanie does not mind ^^
    $(document).click(function(){
      if($.isSuperADmin && $("#available-data tr.selected").length){
        $("#EditButton").attr("disabled", true).addClass("disabled")
        $("#available-data tr.selected").removeClass("selected")
    }})

    // Attach a submit handler to the form
    $( "#dataEdition" ).submit(function( event ) {
    
      // Stop form from submitting normally
      event.preventDefault();
    
      // Get some values from elements on the page:
      var $form = $( this ),
      url = $form.attr("action")
       ctr = $form.find( "#CTRCheck" ).is(':checked') === true ? "true": "",
       tra = $form.find( "#TRA-input" ).val(),
        r_status = $form.find("#validatedCombo").val(),
        v_status = $form.find("#validatedCheck").is(':checked') === true ? "true": "",
        delivery_date = $form.find("#Delivery-Input").val(),
        comment = $form.find('#Comment-input').val()
      if($form.find("#validatedCheck").length && $form.find("#validatedCombo").length)
        {
          //Super Admin Editing
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Results_Status": r_status,
          "Validated_Status": v_status,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "id":$.internalIdSelection,
        };
      }
      else{
        // Basic User Edition
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "id": $.internalIdSelection
        }
      }
      // Send the data using post
      // done has Handler when the posting is done, aka, close the modal and redraw the line
      $.ajax({
        url: url,
        data: data,
        type: "POST",
        success: function(){
        $("#closeEditorButton").click()
        // Reset global variables
        $.internalIdSelection = undefined
        $.selectedRow = undefined
        $.selectedRowDom = undefined
        // Reload the page, TODO only redraw part of the table, see with an ajax call
        location.reload()
        },
        error: function(){
          alert("Update Failure")
          $("#closeEditorButton").click()
          $.internalIdSelection = undefined
          $.selectedRow = undefined
          $.selectedRowDom = undefined 
        }
      })
    })
    
  var table = $('#available-data').DataTable({
    "serverSide": true,
    "columns":[
      {"name": "CTR", "targets": 0},
      {"name": "Results Status"},
      {"name": "Validated Status"},
      {"name": "Aircraft"},
      {"name": "MSN"},
      {"name": "Flight"},
      {"name": "Flight Date"},
      {"name": "Delivery Date"},
      {"name": "Results"},
      {"name": "Airline"},
      {"name": "Tabulated Results"},
      {"name": "Parameters Validation"},
      {"name": "Fleet Follow Up"},
      {"name": "Flight Owner"},
      {"name": "Fuel Flowmeters"},
      {"name": "Fuel Characteristics"},
      {"name": "Weighing"},
      {"name": "TRA"},
      {"name": "Commentary"}
    ],
    "ajax": {
      url: "/table/data",
      method: "POST"
    },
    "columnDefs":[{
  
      // Special Formatting for Validated Status
      "targets":1,
      "render": function(data, type, row, meta){
        switch(data){
          case "Preliminary":
            return '<font color="blue">Preliminary</font>'
          case "Investigation":
            return '<font color="orange">Investigation</font>'
          case "Definitive":
            return '<font color="green">Definitive</font>'
          default:
            return ''
        }
      }
    },
  ],
  colReorder: true,
  responsive: true,
  bStateSave:true,
  dom: 'lBfrtip',
  fnStateSave: function(settings, data){
    localStorage.setItem("DataTables_"+window.location.pathname, JSON.stringify(data))
  },
  fnStateLoad: function(settings){
    var data = localStorage.getItem("DataTables_"+window.location.pathname)
    return JSON.parse(data)
  },
  buttons: [{
    extend: "colvis",
    className: "btn btn-outline-primary ml-2",
    columnText: function(dt, idx, title){
      // Necessary, I do not know why
      return title
    }
  }]
  });
  }
  if($("#upload-results").length){
    $("#upload-results").DataTable({
      "ordering": false,
      "paging": false,
      "searching": false,
      "columnDefs":[
      {
        // Special Formatting for Validated Status
        "targets":1,
        "render": function(data, type, row, meta){
          switch(data){
            case "Preliminary":
              return '<font color="blue">Preliminary</font>'
            case "Investigation":
              return '<font color="orange">Investigation</font>'
            case "Definitive":
              return '<font color="green">Definitive</font>'
            default:
              return ''
          }
        }
      },
    ]
    })
    if($("#Results").length){
      $("Results").DataTable({
        "ordering": false,
        "paging": false,
        "searching": false,
      })
    }
  }
})
