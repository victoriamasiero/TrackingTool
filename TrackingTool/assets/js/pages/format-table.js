"use strict";

$(document).ready(function () {
  // Launch DataTable to make the table look nicer, if there is a table to display...
  if ($('#available-data').length) {

    // Control the Column Visibility Toggles 
    // Prevent the dropdown from auto closing when user click inside
    $("#colVis").on("click.bs.dropdown", function (e) {
      e.stopPropagation();
      e.preventDefault();
    });
    // Detect when user click on a button and hide accordlingly the column
    $("[id^=button_colVis_]").click(function(e){
      $(this).toggleClass("active");
      var table_header = [];
      table.api().columns().every(function () {
        table_header.push(this.header().innerText.trim());
      });
      var header_to_toggle = e.currentTarget.parentElement.innerText.trim();
      console.log(header_to_toggle);
      var idx = table_header.indexOf(header_to_toggle);
      var visible = $(this).hasClass("active");
      table.api().column(idx).visible(visible);
      // Prevent from trigerring the parent
      e.stopPropagation()
    })
    $("[id^=colVis_]").click(function (e) {
      $(this).find("[id^=button_colVis_]").toggleClass("active");
      var table_header = [];
      table.api().columns().every(function () {
        table_header.push(this.header().innerText.trim());
      });
      var header_to_toggle = e.target.innerText.trim();
      console.log(header_to_toggle);
      var idx = table_header.indexOf(header_to_toggle);
      var visible = $(this).find("[id^=button_colVis_]").hasClass("active");
      table.api().column(idx).visible(visible);
    });
    // On Show, detect which columns are currently visible
    $("#colVisMenuLiContainer").on("show.bs.dropdown", function () {
      table.api().columns().every(function () {
        var header = this.header().innerText.trim().replace(/ /g, '_');
        var visible = this.visible();
        if (visible) {
          $("#button_colVis_" + header).addClass("active");
        } else {
          $("#button_colVis_" + header).removeClass("active");
        }
      });
    });
    var headers = window.SAILS_LOCALS["headers"];
    // Modify Modal On Show
    $.isSuperADmin = $("#EditButton").length > 0;
    $.selectedRow = undefined;
    $.selectedRowDom = undefined;
    $.internalIdSelection = undefined;
    // Editor Modal
    $('#Editor').on('show.bs.modal', function () {
      var row = $("#available-data tr.selected");
      $.selectedRow = row.closest('tr').index();
      $.selectedRowDom = row;
      var complete_data_table = table.api().row(row).data();
      var ctr = complete_data_table["CTR"].length > 0 ? true : false;
      var tra = complete_data_table["TRA"];
      var v_status = complete_data_table["Validated_Status"].length > 0 ? true : false;
      var r_status = complete_data_table["Results_Status"];
      if (r_status.indexOf("Preliminary") !== -1) {
        r_status = "Preliminary";
      } else {
        if (r_status.indexOf("Definitive") !== -1) {
          r_status = "Definitive";
        } else {
          r_status = "Investigation";
        }
      }
      var comment = complete_data_table["Commentary"];
      var delivery_date = complete_data_table["Delivery Date"];
      $.internalIdSelection = complete_data_table["id"];
      var modal = $(this);
      modal.find('.modal-body #CTRCheck').prop('checked', ctr);
      modal.find(".modal-body #TRA-input").val(tra);
      modal.find('.modal-body #validatedCombo').val(r_status);
      modal.find('.modal-body #validatedCheck').prop('checked', v_status);
      modal.find('.modal-body #Delivery-Input').val(moment(delivery_date, "DD-MM-YYYY").format("YYYY-MM-DD"));
      modal.find('.modal-body #Comment-input').val(comment);
    });
    $("#available-data tbody").on("click", "tr", function (ev) {
      if ($.isSuperADmin) {
        ev.stopPropagation();
        $("#EditButton").removeAttr("disabled").removeClass("disabled");
        $(this).closest("tr").addClass('selected').siblings().removeClass('selected');
        return true;
      }
    });

    $(document).click(function () {
      if ($.isSuperADmin && $("#available-data tr.selected").length) {
        $("#EditButton").attr("disabled", true).addClass("disabled");
        $("#available-data tr.selected").removeClass("selected");
      }
    });
    // Remove any validation form on keypress
    $("#dataEdition").keypress(function () {
      $(this)[0].classList.remove("was-validated");
    });
    // Attach a submit handler to the form
    $("#dataEdition").submit(function (event) {
      // Select the form and chech validity of it natively
      if ($(this)[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        $(this)[0].classList.add("was-validated");
        return false;
      }

      // Stop form from submitting normally
      event.preventDefault();

      var table_header = [];
      table.api().columns().every(function () {
        table_header.push(this.header().innerText.trim());
      });

      // Get some values from elements on the page:
      var $form = $(this),
        url = $form.attr("action"),
        ctr = $form.find("#CTRCheck").is(':checked') === true ? "true" : "",
        tra = $form.find("#TRA-input").val(),
        r_status = $form.find("#validatedCombo").val(),
        v_status = $form.find("#validatedCheck").is(':checked') === true ? "true" : "",
        delivery_date = $form.find("#Delivery-Input").val().length > 0 ? moment($form.find("#Delivery-Input").val()).format("DD/MM/YYYY") : "",
        comment = _.escape($form.find('#Comment-input').val()),
        row_data = table.api().row($.selectedRowDom).data();
      row_data["TRA"] = tra;
      row_data["Delivery_Date"] = delivery_date;
      row_data["Results_Status"] = r_status;
      row_data["Validated_Status"] = v_status;
      row_data["Commentary"] = comment;
      row_data["CTR"] = ctr;
      if ($form.find("#validatedCheck").length && $form.find("#validatedCombo").length) {
        //Super Admin Editing
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Results_Status": r_status,
          "Validated_Status": v_status,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "id": $.internalIdSelection
        };
      } else {
        // Basic User Edition
        var data = {
          "CTR": ctr,
          "TRA": tra,
          "Delivery_Date": delivery_date,
          "Commentary": comment,
          "id": $.internalIdSelection
        };
      }
      // Send the data using post
      // done has Handler when the posting is done, aka, close the modal and redraw the line
      $.ajax({
        url: url,
        data: data,
        type: "POST",
        success: function success() {
          $("#closeEditorButton").click();
          // Reset global variables
          table.api().row($.selectedRowDom).invalidate();
          $.internalIdSelection = undefined;
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
          // Reload the page, TODO only redraw part of the table, see with an ajax call
          // location.reload()
        },
        error: function error() {
          alert("Update Failure");
          $("#closeEditorButton").click();
          $.internalIdSelection = undefined;
          $.selectedRow = undefined;
          $.selectedRowDom = undefined;
        }
      });
    });
    // JavaScript Source Data Drawing
    var results_status = headers.indexOf("Results_Status");
    var validated_status = headers.indexOf("Validated_Status");
    var ctr_status = headers.indexOf("CTR");
    var results = headers.indexOf("Results");
    var ffu = headers.indexOf("Fleet_Follow_Up");
    var ffu_id = headers.indexOf("Fleet_Follow_Up_id");
    var pv = headers.indexOf("Parameters_Validation");
    var pv_id = headers.indexOf("Parameters_Validation_id");
    var airline = headers.indexOf("Airline");
    var tra = headers.indexOf("TRA");
    var aircraft_ident = headers.indexOf("Aircraft_Identification")
    var aircraft_ident_id = headers.indexOf("Aircraft_Identification_id")
    var airline_id = headers.indexOf("Airline_id");
    var tr = headers.indexOf("Tabulated_Results");
    var tr_id = headers.indexOf("Tabulated_Results_id");
    var id_id = headers.indexOf("id");
    var aircraft_id = headers.indexOf("Aircraft");
    var msn_id = headers.indexOf("MSN");
    var flight_id = headers.indexOf("Flight");
    var comment_id = headers.indexOf("Commentary");
    var dd_id = headers.indexOf("Delivery Date");
    var table = $('#available-data').dataTable({
      // ServerSide done in another branch of the repo
      serverSide: false,
      order: [
        [headers.indexOf("Aircraft"), "asc"]
      ],
      columnDefs: [{
        "className": "dt-center",
        "targets": "_all"
      }, {
        "targets": headers.indexOf("createdAt"),
        "data": "createdAt",
        "visible": false,
        "name": "createdAt",
        "orderable": false,
        "searchable": false
      }, {
        "targets": headers.indexOf("updatedAt"),
        "visible": false,
        "name": "updatedAt",
        "orderable": false,
        "searchable": false,
        "data": "updatedAt"
      }, {
        "targets": id_id,
        "visible": false,
        "name": "id",
        "orderable": false,
        "searchable": false,
        "data": "id"
      }, {
        "targets": pv_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Parameters_Validation_id"
      }, {
        "targets": tr_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Tabulated_Results_id"
      }, {
        "targets": airline_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Airline_id"
      }, {
        "targets": ffu_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Fleet_Follow_Up_id"
      }, {
        "targets": aircraft_ident_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Aircraft_Identification_id"
      }, {
        "targets": dd_id,
        "name": "Delivery Date",
        "width": "5%",
        "data": "Delivery_Date"
      }, {
        "targets": comment_id,
        "name": "Commentary",
        "width": "5%",
        "data": "Commentary"
      }, {
        "targets": headers.indexOf("MSN"),
        "name": "MSN",
        "data": "MSN",
        "width": "5%"
      }, {
        "targets": headers.indexOf("Aircraft"),
        "name": "Aircraft",
        "data": "Aircraft",
        "width": "5%"
      }, {
        "targets": headers.indexOf("Flight"),
        "name": "Flight",
        "data": "Flight",
        "width": "5%"
      }, {
        "targets": headers.indexOf("Flight_Owner"),
        "name": "Flight Owner",
        "data": "Flight_Owner",
        "width": "5%"
      }, {
        "targets": headers.indexOf("Fuel_Flowmeters"),
        "name": "Fuel Flowmeters",
        "data": "Fuel_Flowmeters",
        "width": "5%"
      }, {
        "targets": headers.indexOf('Flight_Date'),
        "name": "Flight Date",
        "data": "Flight_Date",
        "width": "5%"
      }, {
        "targets": headers.indexOf("Fuel_Characteristics"),
        "name": "Fuel Characteristics",
        "data": "Fuel_Characteristics",
        "width": "5%"
      }, {
        "targets": headers.indexOf("Weighing"),
        "name": "Weighing",
        "data": "Weighing",
        "width": "5%"
      }, {
        // Special Formatting for Validated Status
        "targets": results_status,
        "name": "Results Status",
        "data": "Results_Status",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          switch (data) {
            case "Preliminary":
              return '<font color="blue">Preliminary</font>';
            case "Investigation":
              return '<font color="orange">Investigation</font>';
            case "Definitive":
              return '<font color="green">Definitive</font>';
            default:
              return '';
          }
        }
      }, {
        "targets": validated_status,
        "name": "Validated Status",
        "data": "Validated_Status",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          if (data !== "" && data !== undefined) {
            return '<i class="fa fa-check fa-lg" style="color:green"></i>';
          } else {
            return '';
          }
        }
      }, {
        "targets": ctr_status,
        "name": "CTR",
        "data": "CTR",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          if (data !== "" && data !== undefined) {
            return '<i class="fa fa-check fa-lg" style="color:green"></i>';
          } else {
            return '';
          }
        }
      }, {
        "targets": ffu,
        "name": "Fleet Follow Up",
        "data": "Fleet_Follow_Up",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Fleet_Follow_Up_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": aircraft_ident,
        "name": "Aircraft Identification",
        "data": "Aircraft_Identification",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Aircraft_Identification_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": pv,
        "data": "Parameters_Validation",
        "name": "Parameters Validation",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Parameters_Validation_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": tr,
        "data": "Tabulated_Results",
        "name": "Tabulated Results",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Tabulated_Results_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": airline,
        "data": "Airline",
        "name": "Airline",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<a href="/account/file/download/' + row["Airline_id"] + '"' + ' target="_blank"><i class="fa fa-file fa-lg" style="color:rgb(98, 166, 255)"></i></a>';
        }
      }, {
        "targets": results,
        "data": "Results",
        "name": "Results",
        "orderable": false,
        "searchable": false,
        "width": "5%",
        "render": function render(data, type, row, meta) {
          return '<button type="button" id="ResultsButton_' + row["id"] + '"' + 'class="btn btn-primary" style="text-transform:capitalize" data-toggle="modal" data-target="#Results">View Table </button>';
        }
      }, {
        "targets": tra,
        "name": "TRA",
        "data": "TRA",
        "width": "5%",
        "render": function render(data, type, row, meta) {
          if (data === undefined || data === "") {
            return '';
          } else {
            var linkName = "CRUISE PERFORMANCE " + row[aircraft_id] + " MSN " + row[msn_id] + " FLIGHT " + row[flight_id];
            return '<a href=' + data + ' target="_blank">' + linkName + "</a>";
          }
        }
      }],
      bDeferRender: true,
      iDisplayLength: 10,
      bProcessing: true,
      colReorder: true,
      responsive: true,
      bStateSave: true,
      paging: true,
      dom: 'lBfrtip',
      fnStateSave: function fnStateSave(settings, data) {
        localStorage.setItem("DataTables_" + window.location.pathname, JSON.stringify(data));
      },
      fnStateLoad: function fnStateLoad(settings) {
        var data = localStorage.getItem("DataTables_" + window.location.pathname);
        return JSON.parse(data);
      },
      buttons: []
    });
    // Get the data
    var liste = window.SAILS_LOCALS["data"];
    // Liste could be undefined after a search for instance
    if (liste !== undefined) {
      var hidden_indexes = [];
      table.fnAddData(liste, false);
      var _arr = ["id", "Airline_id", "Tabulated_Results_id", "Parameters_Validation_id", "Fleet_Follow_Up_id"];
      for (var _i = 0; _i < _arr.length; _i++) {
        var name = _arr[_i];
        hidden_indexes.push(headers.indexOf(name));
        table.fnSetColumnVis(headers.indexOf(name), false);
      }
      // Draw the table
      table.fnDraw();
    }
    // Trigger the Results Modal when the user clicks on the "View Table" Button
    $("[id^=ResultsButton_]").click(function () {
      $.selectedRowDom = $(this).closest("tr");
      $("#Results").modal("show");
    });
    // Results Modal
    $("#Results").on("show.bs.modal", function () {
      var row = $.selectedRowDom;
      if (row.length === 0) {
        alert("Did you click somewhere ?");
      }

      $.selectedRow = row.closest('tr').index()
      var complete_data_table = table.api().row(row).data()
      console.log(complete_data_table)
      var results_table = complete_data_table["Results"]
      console.log(results_table)
      // insertAfter is not the one to use, maybe append
      $("#TableContainer").append(results_table);
    });
    $("#Results").on("hide.bs.modal", function () {
      // Empty the modal on hide
      $("#TableContainer").empty();
    });
  }
  if ($("#upload-results").length) {
    var headers = window.SAILS_LOCALS["headers"];
    var results_status = headers.indexOf("Results_Status");
    var validated_status = headers.indexOf("Validated_Status");
    var ctr_status = headers.indexOf("CTR");
    var results = headers.indexOf("Results");
    var ffu = headers.indexOf("Fleet_Follow_Up");
    var ffu_id = headers.indexOf("Fleet_Follow_Up_id");
    var pv = headers.indexOf("Parameters_Validation");
    var pv_id = headers.indexOf("Parameters_Validation_id");
    var airline = headers.indexOf("Airline");
    var tra = headers.indexOf("TRA");
    var aircraft_ident = headers.indexOf("Aircraft_Identification")
    var aircraft_ident_id = headers.indexOf("Aircraft_Identification_id")
    var airline_id = headers.indexOf("Airline_id");
    var tr = headers.indexOf("Tabulated_Results");
    var tr_id = headers.indexOf("Tabulated_Results_id");
    var id_id = headers.indexOf("id");
    var aircraft_id = headers.indexOf("Aircraft");
    var msn_id = headers.indexOf("MSN");
    var flight_id = headers.indexOf("Flight");
    var comment_id = headers.indexOf("Commentary");
    var dd_id = headers.indexOf("Delivery Date");
    $("#upload-results").DataTable({
      ordering: false,
      paging: false,
      searching: false,
      columnDefs: [{
        "className": "dt-center",
        "targets": "_all"
      }, {
        "targets": headers.indexOf("createdAt"),
        "data": "createdAt",
        "visible": false,
        "name": "createdAt",
        "orderable": false,
        "searchable": false
      }, {
        "targets": headers.indexOf("updatedAt"),
        "visible": false,
        "name": "updatedAt",
        "orderable": false,
        "searchable": false,
        "data": "updatedAt"
      }, {
        "targets": id_id,
        "visible": false,
        "name": "id",
        "orderable": false,
        "searchable": false,
        "data": "id"
      }, {
        "targets": pv_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Parameters_Validation_id"
      }, {
        "targets": tr_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Tabulated_Results_id"
      }, {
        "targets": airline_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Airline_id"
      }, {
        "targets": ffu_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Fleet_Follow_Up_id"
      },{
        "targets": aircraft_ident_id,
        "visible": false,
        "orderable": false,
        "searchable": false,
        "data": "Aircraft_Identification_id"
      }, {
        "targets": dd_id,
        "name": "Delivery Date",
        "data": "Delivery_Date"
      }, {
        "targets": comment_id,
        "name": "Commentary",
        "data": "Commentary"
      }, {
        "targets": headers.indexOf("MSN"),
        "name": "MSN",
        "data": "MSN"
      }, {
        "targets": headers.indexOf("Aircraft"),
        "name": "Aircraft",
        "data": "Aircraft"
      }, {
        "targets": headers.indexOf("Flight"),
        "name": "Flight",
        "data": "Flight"
      }, {
        "targets": headers.indexOf("Flight_Owner"),
        "name": "Flight Owner",
        "data": "Flight_Owner"
      }, {
        "targets": headers.indexOf("Fuel_Flowmeters"),
        "name": "Fuel Flowmeters",
        "data": "Fuel_Flowmeters"
      }, {
        "targets": headers.indexOf('Flight_Date'),
        "name": "Flight Date",
        "data": "Flight_Date"
      }, {
        "targets": headers.indexOf("Fuel_Characteristics"),
        "name": "Fuel Characteristics",
        "data": "Fuel_Characteristics"
      }, {
        "targets": headers.indexOf("Weighing"),
        "name": "Weighing",
        "data": "Weighing"
      }, {
        // Special Formatting for Validated Status
        "targets": results_status,
        "name": "Results Status",
        "data": "Results_Status",
        "render": function render(data, type, row, meta) {
          switch (data) {
            case "Preliminary":
              return '<font color="blue">Preliminary</font>';
            case "Investigation":
              return '<font color="orange">Investigation</font>';
            case "Definitive":
              return '<font color="green">Definitive</font>';
            default:
              return '';
          }
        }
      }, {
        "targets": validated_status,
        "name": "Validated Status",
        "data": "Validated_Status",
        "render": function render(data, type, row, meta) {
          if (data !== "" && data !== undefined) {
            return '<i class="fa fa-check fa-lg" style="color:green"></i>';
          } else {
            return '';
          }
        }
      }, {
        "targets": ctr_status,
        "name": "CTR",
        "data": "CTR"
      }, {
        "targets": ffu,
        "name": "Fleet Follow Up",
        "data": "Fleet_Follow_Up"
      }, {
        "targets": pv,
        "data": "Parameters_Validation",
        "name": "Parameters Validation",
        "orderable": false,
        "searchable": false
      }, {
        "targets": tr,
        "data": "Tabulated_Results",
        "name": "Tabulated Results",
        "orderable": false,
        "searchable": false
      }, {
        "targets": airline,
        "data": "Airline",
        "name": "Airline",
        "orderable": false,
        "searchable": false
      },{
        "targets": aircraft_ident,
        "data": "Aircraft_Identification",
        "name": "Aircraft_identification",
        "orderable": false,
        "searchable": false
      }, {
        "targets": results,
        "data": "Results",
        "name": "Results",
        "orderable": false,
        "searchable": false
      }, {
        "targets": tra,
        "name": "TRA",
        "data": "TRA"
      }]
    });
  }
});