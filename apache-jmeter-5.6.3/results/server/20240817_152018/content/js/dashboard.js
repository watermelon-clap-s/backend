/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 12.470245966675483, "KoPercent": 87.52975403332452};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.09888257074847924, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.713, 500, 1500, "메인 페이지  기대평 가져오기"], "isController": false}, {"data": [0.7825, 500, 1500, "선착순 이벤트들 조회 (처음 진입)"], "isController": false}, {"data": [0.0, 500, 1500, "정답 제출"], "isController": false}, {"data": [0.0, 500, 1500, "선착순 이벤트들 조회 (새로 고침)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15124, 13238, 87.52975403332452, 18203.63660407299, 2, 281306, 21.0, 75000.0, 146999.75, 262486.0, 52.15909835528471, 131.00033983791673, 1.026451692308223], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["메인 페이지  기대평 가져오기", 1000, 54, 5.4, 4448.083, 64, 262489, 270.0, 2236.3999999999996, 4009.0, 145893.05000000005, 3.687859566307715, 5.132085156134754, 0.6541340905738309], "isController": false}, {"data": ["선착순 이벤트들 조회 (처음 진입)", 1000, 60, 6.0, 670.7520000000001, 2, 60674, 113.5, 1244.2999999999997, 1389.8999999999999, 1545.92, 3.709405196876681, 7.1155158043845175, 0.4460704647884712], "isController": false}, {"data": ["정답 제출", 2000, 2000, 100.0, 136.93000000000004, 2, 3008, 7.0, 24.90000000000009, 2006.0, 2031.95, 179.95321216483714, 476.7705709015656, 0.0], "isController": false}, {"data": ["선착순 이벤트들 조회 (새로 고침)", 11124, 11124, 100.0, 24264.572545846804, 4, 281306, 17.0, 118778.5, 162652.5, 266929.75, 39.514347217584664, 104.34873391754702, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Connection refused (Connection refused)", 11256, 85.02794984136577, 74.42475535572599], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 1289, 9.737120410938209, 8.522877545622851], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Operation timed out (Connection timed out)", 693, 5.234929747696026, 4.582121131975668], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15124, 13238, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Connection refused (Connection refused)", 11256, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 1289, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Operation timed out (Connection timed out)", 693, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["메인 페이지  기대평 가져오기", 1000, 54, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 19, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Operation timed out (Connection timed out)", 19, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Connection refused (Connection refused)", 16, "", "", "", ""], "isController": false}, {"data": ["선착순 이벤트들 조회 (처음 진입)", 1000, 60, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Connection refused (Connection refused)", 54, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["정답 제출", 2000, 2000, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Connection refused (Connection refused)", 2000, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["선착순 이벤트들 조회 (새로 고침)", 11124, 11124, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Connection refused (Connection refused)", 9186, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 1264, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 43.202.54.29:8080 [/43.202.54.29] failed: Operation timed out (Connection timed out)", 674, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
