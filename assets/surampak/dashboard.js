

update_data_gpu();
update_data_server();

setInterval(function(){
    update_data_gpu();
},(1000*60)*1);

//load_gpu
function update_data_gpu(){
    $.ajax({
        url: "https://scm.jumpa.id/controlmonitoring_load_gpu/api_gpu_list",
        async: true,
        type:"get",
        dataType: 'json',
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (result) {

            try {
                    var object;
                    if ((typeof result) != 'object') {object = JSON.parse(result);} else {object = result;}
                    if (object['value'] == 'GPU not found') {
                        $("#gpu_ada").attr('style','display:none;');
                        $("#gpu_tidakada").attr('style','display:block;');
                    } else {
                        $("#gpu_ada").attr('style','display:block;');
                        $("#gpu_tidakada").attr('style','display:none;');
                        $.each(object['value'], function (index, value) {
                            var barGpu = $("#gpu_bar"+value['id']);
                            barGpu.attr("aria-valuenow", value['percent']);
                            barGpu.attr("style", "width:"+value['percent']+"%");
                            if (value['percent'] > 50) {
                                if (value['percent'] > 90) {
                                    barGpu.attr("class", "progress-bar bg-danger");
                                } else {
                                    barGpu.attr("class", "progress-bar bg-warning");
                                }
                            } else {
                                barGpu.attr("class", "progress-bar bg-success");
                            }

                            $("#gpu_hostpart"+value['id']).attr("style","color: #800");
                            setTimeout(function(){
                                if (value['total_host'] != 0) {
                                    $("#gpu_hostpart"+value['id']).attr("style","color: green");
                                } else {
                                    $("#gpu_hostpart"+value['id']).attr("style","color: grey");
                                }
                            }, 2000);

                            if (value['total_host'] != 0) {
                                $("#gpu_hostpart"+value['id']).html("Users: "+value['total_participant']+"<p style='font-size:14px;' class='text-muted mt-2 mb-0'>Hosts: "+value['total_host']+"</p>");
                            } else {
                                $("#gpu_hostpart"+value['id']).html("Empty <p style='font-size:14px;' class='text-muted mt-2 mb-0'>-</p>");
                            }
                            
                            $("#memory_used"+value['id']).html(value['memory_used']+"/"+value['memory_total']+"MB");
                            $("#gpu_percent"+value['id']).html(value['percent']+"%");
                            $("#gpu_pwr"+value['id']).html(Number(value['power_usage']/1000).toFixed(2)+"W");
                            $("#gpu_tmp"+value['id']).html("TMP: "+value['temperature']+"C");
                            $("#gpu_update"+value['id']).html(value['update_at']);

                        });
                    }
                } catch (e) {
                    console.error("error euy: " + e)
                } 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

//load_server
function update_data_server(){
    $.ajax({
        url: "https://scm.jumpa.id/controlmonitoring_load_server/api_server_list",
        async: true,
        type:"get",
        dataType: 'json',
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (result) {

            try {
                    var object;
                    if ((typeof result) != 'object') {object = JSON.parse(result);} else {object = result;}
                    
                    // console.error(object['value']);
                    implement_to_chart_server(object['value']);
                    
                } catch (e) {
                    console.error("error euy: " + e)
                } 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function implement_to_chart_server(object){
    
    $.each(object, function (index, value){
        google.charts.load('current', {'packages':['gauge', 'corechart']});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            
            //cpu
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Core');
            data.addColumn('number', 'CPU');
            data.addRows([
                [value['core'] + " CPU", parseInt(value['cpu'])]
            ]);
            var options = {
                  height:'100%',
                  width:'100%',
                  backgroundColor: 'transparent',
                  redFrom: 90, redTo: 100,
                  yellowFrom:75, yellowTo: 90,
                  greenFrom:40, greenTo:75,
                  minorTicks: 10,
            };
            var chart = new google.visualization.Gauge(document.getElementById('chart'+value['id']));
            chart.draw(data, options);

            //ram
            var data_ram = google.visualization.arrayToDataTable([
              ['RAM', 'Usage'],
              ['RAM '+ value['ram'] +'GB', parseFloat(value['usage_ram'])],
            ]);

            var total_ram = parseFloat(value['ram']);
            parseFloat(value['usage_ram']) > total_ram*0.6 ? parseFloat(value['usage_ram']) > total_ram*0.8  ? warna = 'red' : warna = 'yellow' : warna='green';
            var options_ram = {
                legend: {position: 'none'},
                backgroundColor: 'transparent',
                height:'100%',
                width:'100%',
                  vAxis: {
                    minValue: 0,
                    ticks: [0,total_ram*0.25,total_ram*0.5,total_ram*0.75,total_ram],
                    textPosition: 'none'
                },
                colors: [warna],
            };
            var chart_ram = new google.visualization.SteppedAreaChart(document.getElementById('chartram'+value['id']));
            chart_ram.draw(data_ram, options_ram);

            // hdd
            var data_hdd = google.visualization.arrayToDataTable([
              ['judul', 'nilai'],
              ['free',  parseFloat(value['free_hdd'])],
              ['usage',  parseFloat(value['usage_hdd'])],
            ]);

            var options_hdd = {
                legend: 'none',
                pieSliceText: 'label',
                backgroundColor: 'transparent',
                title: 'Disk ' + value['hdd'] + ' GB',
                slices: {
                    0: { color: 'green' },
                    1: { color: 'red' }
                }
            };

            var chart_hdd = new google.visualization.PieChart(document.getElementById('charthdd'+value['id']));
            chart_hdd.draw(data_hdd, options_hdd);



            setInterval(function() {
                $.ajax({
                    url: "https://scm.jumpa.id/controlmonitoring_load_server/api_server_list/"+value['id'],
                    async: true,
                    type:"get",
                    dataType: 'json',
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    success: function (result) {
                        $("#judulServer"+value['id']).attr("style","color: #800");
                        setTimeout(function(){
                            $("#judulServer"+value['id']).removeAttr("style");
                        }, 2000);
                        try {
                                var objectdetail;
                                if ((typeof result) != 'object') {objectdetail = JSON.parse(result);} else {objectdetail = result;}

                                data.setValue(0, 1, parseInt(objectdetail['value']['cpu']));
                                chart.draw(data, options);

                                parseFloat(objectdetail['value']['usage_ram']) > total_ram*0.6 ? parseFloat(objectdetail['value']['usage_ram']) > total_ram*0.8  ? warna = 'red' : warna = 'yellow' : warna='green';
                                var options_ram = {
                                    legend: {position: 'none'},
                                    backgroundColor: 'transparent',
                                    height:'100%',
                                    width:'100%',
                                      vAxis: {
                                        minValue: 0,
                                        ticks: [0,total_ram*0.25,total_ram*0.5,total_ram*0.75,total_ram],
                                        textPosition: 'none'
                                    },
                                    colors: [warna],
                                };

                                data_ram.setValue(0, 1, parseFloat(objectdetail['value']['usage_ram']));
                                chart_ram.draw(data_ram, options_ram);

                                data_hdd.setValue(0, 1, parseFloat(objectdetail['value']['free_hdd']));
                                chart_hdd.draw(data_hdd, options_hdd);

                                $("#server_update"+value['id']).html("updated: " + objectdetail['value']['upload_date']);

                                $.get("https://scm.jumpa.id/dashboard/total_host/"+objectdetail['value']['domain'], { }, function(text) {
                                    $("#host"+value['id']).html("<b>Active Host: " + text + "</b>");
                                    if (parseInt(text) == 0) {
                                        $("#host"+value['id']).attr("style","color: darkgrey");
                                        console.error("Enol");
                                    } else if (parseInt(text) > 0) {
                                        $("#host"+value['id']).attr("style","color: green");
                                        console.error("Leuwih ti hiji");
                                    } else {
                                        $("#host"+value['id']).attr("style","color: #800");
                                        console.error("Acan di konfig");
                                    }
                                });
                            } catch (e) {
                                console.error("error euy: " + e)
                            } 
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
              
            }, 1000*61);
        }
    
    });
}


