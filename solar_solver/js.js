// Constants
const BASEURL = "https://developer.nrel.gov/api/pvwatts/v6.json"
const PVWATTS_API_KEY = "TgLr3h6XUeQnpRVmTNkf5jf9rEB4gJXqeJzbeGZi";

var pvwattsResult = "";

// Event Handler for Calculate Button - Where the magic happens - Causes API Call and Table Generation
$("#buttonCalculate").on("click", function (event) {
  $("#result").text("heyo");
  var lat = $("#inputLat").val();
  var lon = $("#inputLong").val();
  var address = $("#inputAddress").val();
  var system_capacity = $("#inputCapacity").val();
  var azimuth = $("#inputAzimuth").val();
  var tilt = $("#inputTilt").val();
  var array_type = $("#inputArrayType").val();
  var module_type = $("#inputModuleType").val();
  var losses = $("#inputLosses").val();
  var url = "";
  if (lat.length > 1 && lon.length > 1) {
    url = BASEURL + "?api_key=" + PVWATTS_API_KEY + "&lat=" + lat + "&lon=" + lon + "&system_capacity=" + system_capacity + "&azimuth=" + azimuth + "&tilt=" + tilt + "&array_type=" + array_type + "&module_type=" + module_type + "&losses=" + losses;
  } else if (address.length > 1) {
    var url = BASEURL + "?api_key=" + PVWATTS_API_KEY + "&address=" + address + "&system_capacity=" + system_capacity + "&azimuth=" + azimuth + "&tilt=" + tilt + "&array_type=" + array_type + "&module_type=" + module_type + "&losses=" + losses;

  } else {
    alert("Please use the Google Maps address picker or enter an address manually before running a calculation.");
  }
  console.log(url)
  $.ajax({
    url: url,
    success: function (result) {
      pvwattsResult = result;
      console.log(pvwattsResult);
      createInputTable(pvwattsResult);
      createOutputTable(pvwattsResult);
      $("#resultJson").html("<H3 class='result' href='outputsMonthly'>JSON</h3>" + syntaxHighlight(JSON.stringify(result, null, 2)));
    }
  });

});

// Quick and dirty CSV/JSON Export of all data
// TODO Selective report saving - perhaps an Excel with multiple sheets?
$("#buttonSaveReport").on("click", function (event) {
  if (pvwattsResult.length > 1) {
    download_table_as_csv("outputsMonthly", ",");
    download_table_as_csv("outputsAnnual", ",");
    download_table_as_csv("inputsTable", ",");
    download_string(JSON.stringify(pvwattsResult, null, 2), "PVWatts-JSON", "json");
  } else {
    alert("Please run a calculation before saving a report.");
  }

});

// Flatten PVWAtts Outputs to HTML Tables
function createOutputTable(json) {
  var outputs = json.outputs;
  var numMonths = Object.keys(json.outputs.ac_monthly).length;
  var table = "";
  table += "<h3 class='result'>Outputs - Monthly</h3>"
  table += "<table class='table' id ='outputsMonthly'>";
  table += "<thead>";
  table += "<tr>";
  table += "<th scope='col'>$ Value (AC Monthly x Utility Rate)</th>";
  table += "<th scope='col'>AC Monthly</th>";
  table += "<th scope='col'>POA Monthly</th>";
  table += "<th scope='col'>SolRad Monthly</th>";
  table += "<th scope='col'>DC Monthly</th>";
  table += "</tr>";
  table += "</thead>";
  table += "<tbody>";
  for (i = 0; i < numMonths; i++) {
    var electricityValue = "$" + parseFloat($("#inputUtilityRate").val() * outputs.ac_monthly[i]).toFixed(2);
    table += "<tr>";
    table += "<td>" + electricityValue + "</td>";
    table += "<td>" + outputs.ac_monthly[i] + "</td>";
    table += "<td>" + outputs.poa_monthly[i] + "</td>";
    table += "<td>" + outputs.solrad_monthly[i] + "</td>";
    table += "<td>" + outputs.dc_monthly[i] + "</td>";
    table += "</tr>";
  }
  table += "</tbody>";
  table += "</table>";

  table += "<h3 class='result'>Outputs - Totals</h3>"
  table += "<table class='table' id ='outputsAnnual'>";
  table += "<thead>";
  table += "<tr>";
  table += "<th scope='col'>AC Annual</th>";
  table += "<th scope='col'>SolRad Annual</th>";
  table += "<th scope='col'>Capacity Factor</th>";
  table += "</tr>";
  table += "</thead>";
  table += "<tbody>";
  table += "<tr>";
  table += "<td>" + outputs.ac_annual + "</td>";
  table += "<td>" + outputs.solrad_annual + "</td>";
  table += "<td>" + outputs.capacity_factor + "</td>";
  table += "</tr>";
  table += "</tbody>";

  console.log(table);
  $("#resultOutputTable").html(table);
}

// Create Table of PWatts Input Variables
function createInputTable(json) {
  var table = "";
  var inputs = json.inputs;
  table += "<h3 class='result'>Inputs</h3>"
  table += "<table class='table' id='inputsTable'>";
  table += "<thead>";
  table += "<tr>";
  table += "<th scope='col'>Key</th>";
  table += "<th scope='col'>Value</th>";
  table += "</tr>";
  table += "</thead>";
  table += "<tbody>";
  Object.keys(inputs).forEach(function (k) {
    table += "<tr>";
    table += "<td>" + k + "</td>";
    table += "<td>" + inputs[k] + "</td>";
    table += "</tr>";
  });
  table += "</tbody>";
  table += "</table>";
  console.log(table);
  $("#resultInputTable").html(table);
}

// Slider Event Handlers - Probably a less expensive way to handle this...
$("#inputCapacity").on("mousemove", function (event) {
  $("#labelCapacity").text($("#inputCapacity").val() + " kWH");
});

$("#inputLosses").on("mousemove", function (event) {
  $("#labelLosses").text((parseFloat($("#inputLosses").val()) * 100).toFixed(0) + " %");
});

$("#inputTilt").on("mousemove", function (event) {
  $("#labelTilt").text($("#inputTilt").val() + " degrees");
});

$("#inputAzimuth").on("mousemove", function (event) {
  $("#labelAzimuth").text($("#inputAzimuth").val() + " degrees");
});






















// vvvvvvvvvv ~ NOT MY CODE ~ vvvvvvvvv

// Credit https://stackoverflow.com/a/56370447
function download_table_as_csv(table_id, separator = ',') {
  // Select rows from table_id
  var rows = document.querySelectorAll('table#' + table_id + ' tr');
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll('td, th');
    for (var j = 0; j < cols.length; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
      // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  var csv_string = csv.join('\n');
  // Download it
  download_string(csv_string, table_id, "csv");
}
// Adapted from https://stackoverflow.com/a/56370447
function download_string(string, filename, filetype) {
  // Download it
  var filename = 'export_' + filename + '_' + new Date().toLocaleDateString() + '.' + filetype;
  var link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/' + filetype + ';charset=utf-8,' + encodeURIComponent(string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// Credit user123444555621 https://stackoverflow.com/a/7220510
function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
// GOOGLE MAPS AUTOCOMPLETE WIDGET
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {

  const map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 40.749933,
      lng: -73.98633
    },
    zoom: 13,
  });
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");

  const biasInputElement = document.getElementById("use-location-bias");
  const strictBoundsInputElement = document.getElementById("use-strict-bounds");
  const options = {
    componentRestrictions: {
      country: "us"
    },
    fields: ["formatted_address", "geometry", "name"],
    origin: map.getCenter(),
    strictBounds: false,
    types: ["address"],
  };
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      document.getElementById("inputAddress").value = place.formatted_address;
      document.getElementById("inputLat").value = place.geometry.location.lat();
      document.getElementById("inputLong").value = place.geometry.location.lng();

      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {


    const radioButton = document.getElementById(id);
    radioButton.addEventListener("click", () => {
      autocomplete.setTypes(types);
      input.value = "";
    });
  }
  setupClickListener("changetype-all", []);
  setupClickListener("changetype-address", ["address"]);
  setupClickListener("changetype-establishment", ["establishment"]);
  setupClickListener("changetype-geocode", ["geocode"]);
  biasInputElement.addEventListener("change", () => {
    if (biasInputElement.checked) {
      autocomplete.bindTo("bounds", map);
    } else {
      // User wants to turn off location bias, so three things need to happen:
      // 1. Unbind from map
      // 2. Reset the bounds to whole world
      // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
      autocomplete.unbind("bounds");
      autocomplete.setBounds({
        east: 180,
        west: -180,
        north: 90,
        south: -90
      });
      strictBoundsInputElement.checked = biasInputElement.checked;
    }
    input.value = "";
    document.getElementById("addressTest").innerHTML = "hi";
  });
  strictBoundsInputElement.addEventListener("change", () => {
    autocomplete.setOptions({
      strictBounds: strictBoundsInputElement.checked,
    });

    if (strictBoundsInputElement.checked) {
      biasInputElement.checked = strictBoundsInputElement.checked;
      autocomplete.bindTo("bounds", map);
    }
    input.value = "";
    document.getElementById("addressTest").innerHTML = "hi";

  });
}
