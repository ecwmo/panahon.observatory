function climate(p, box) {
  var vis = (box.checked) ? 'block' : 'none';
  document.getElementById(p).style.display = vis;
}

function clselect(v) {
  switch(v) {
    case 'all': document.getElementById('map_rain_ave').style.display = 'block';
                document.getElementById('map_rain_max').style.display = 'block';
                document.getElementById('map_temp_min').style.display = 'block';
                document.getElementById('map_temp_ave').style.display = 'block';
                document.getElementById('map_temp_max').style.display = 'block';
                document.getElementById('rain_ave').checked = true;
                document.getElementById('rain_max').checked = true;
                document.getElementById('temp_min').checked = true;
                document.getElementById('temp_ave').checked = true;
                document.getElementById('temp_max').checked = true; break;
    case 'none': document.getElementById('map_rain_ave').style.display = 'none';
                 document.getElementById('map_rain_max').style.display = 'none';
                 document.getElementById('map_temp_min').style.display = 'none';
                 document.getElementById('map_temp_ave').style.display = 'none';
                 document.getElementById('map_temp_max').style.display = 'none';
                 document.getElementById('rain_ave').checked = false; 
                 document.getElementById('rain_max').checked = false;
                 document.getElementById('temp_min').checked = false;
                 document.getElementById('temp_ave').checked = false;
                 document.getElementById('temp_max').checked = false; break;
  }
}