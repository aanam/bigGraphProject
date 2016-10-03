(function() {

    var $ = jQuery;

    var data = {
        nodeCount: 1,
        relCount: 0,
        dataBytesPerNode: 20,
        dataBytesPerRel: 0,
        
        concurrentRequestsPerSecond: 1,

        numberOfServers: 0,
        numberOfCoresPerServer: 0,
        hostingPlatform: "aws",
        currentDatabase: "none",
        amountOfRAM: 0,

        /* temp vars */
        totalUsers: 0,
        visitsPerDayPerUser: 0,
        averageRequestTime: 20,
        relsPerNode: 0

    };

    $(document).ready(function() {

        $("#result").hide();
        $("#error").hide();
        $("#numberOfServers").focus();

        $("#calculate").click(function(e){
            forceUpdateResult();
        });

        $("#numberOfServers").change(function(e) {
            updateNumberOfServers(parseSize(this.value));
            updateResult();
        });
        $("#numberOfCoresPerServer").change(function(e) {
            updateNumberOfCoresPerServer(parseSize(this.value));
            updateResult();
        });
        $("#amountOfRAM").change(function(e) {
            updateAmountOfRAM(parseSize(this.value));
            updateResult();
        });
        $("#hostingPlatform").change(function(e) {
            updateHostingPlatform(this.options[this.selectedIndex].value);
            updateResult();
        });
        $("#currentDatabase").change(function(e) {
            updateCurrentDatabase(this.options[this.selectedIndex].value);
            updateResult();
        });

        $("#nodeCount").change(function(e) {
            updateNodeCount(parseSize(this.value));
            updateResult();
        });
        $("#relCount").change(function(e) {
            updateRelCount(parseSize(this.value));
            updateResult();
        });
        $("#relsPerNode").change(function(e) {
            updateRelsPerNode(parseSize(this.value));
            updateResult();
        });

        $("#dataBytesPerNode").change(function(e) {
            updateDataBytesPerNode(parseSize(this.value));
            updateResult();
        });
        $("#dataBytesPerRel").change(function(e) {
            updateDataBytesPerRel(parseSize(this.value));
            updateResult();
        });

        $("#concurrentRequestsPerSecond").change(function(e) {
            updateConcurrentRequestsPerSecond(parseSize(this.value));
            updateResult();
        });
        $("#totalUsers").change(function(e) {
            updateTotalUsers(parseSize(this.value));
            updateResult();
        });
        $("#visitsPerDayPerUser").change(function(e) {
            updateVistsPerDayPerUser(parseSize(this.value));
            updateResult();
        });
        $("#averageRequestTime").change(function(e) {
            updateAverageRequestTime(parseSize(this.value));
            updateResult();
        });

        updateResult();

    });

    function updateNumberOfServers(value) {
        if (isNumber(value)) data.numberOfServers = value;
    }
    function updateNumberOfCoresPerServer(value) {
        if (isNumber(value)) data.numberOfCoresPerServer = value;
    }
    function updateAmountOfRAM(value) {
        if (isNumber(value)) data.amountOfRAM = value;
    }
    function updateHostingPlatform(value) {
        data.hostingPlatform = value;
    }
    function updateCurrentDatabase(value) {
        data.currentDatabase = value;
    }

    function updateNodeCount(value) {
        data.nodeCount = value;
        updateRelsPerNode();
        updateRelCount();
    }

    function updateRelCount(value) {
        if (isNumber(value)) data.relCount = value;
        if (data.nodeCount > 0) {
            data.relsPerNode = data.relCount / data.nodeCount * 2;
        }
    }

    function updateRelsPerNode(value) {
        if (isNumber(value)) data.relsPerNode = value;
        data.relCount = data.nodeCount * data.relsPerNode / 2;
    }
    function updateDataBytesPerNode(value) {
        if (isNumber(value)) data.dataBytesPerNode = value;
    }
    function updateDataBytesPerRel(value) {
        if (isNumber(value)) data.dataBytesPerRel = value;
    }
    function updateConcurrentRequestsPerSecond(value) {
        if (isNumber(value)) data.concurrentRequestsPerSecond = value;
    }
    function updateTotalUsers(value) {
        if(isNumber(value)) data.totalUsers = value;
        tryRefreshConcurrent();
    }
    function updateVistsPerDayPerUser(value) {
        if(isNumber(value)) data.visitsPerDayPerUser = value;
        tryRefreshConcurrent();
    }
    function updateAverageRequestTime(value) {
        if(isNumber(value)) data.averageRequestTime = value;
        tryRefreshConcurrent();
    }
    function tryRefreshConcurrent() {
        if (data.totalUsers > 0 && data.visitsPerDayPerUser > 0 && data.averageRequestTime > 0) {
            var totalVisitsPerSecond = data.totalUsers * data.visitsPerDayPerUser / 86400;
            var totalVisitsPerMillis = totalVisitsPerSecond / 1000;
            data.concurrentRequestsPerSecond = Math.ceil(totalVisitsPerMillis * data.averageRequestTime);
        }
    }

    function validate() {
        if(data.nodeCount <= 0) { alert("Must have at least 1 node."); return false; }
        if(data.nodeCount >= Math.pow(2, 35)) { alert("There is currently a limit of 2^35 (~34B) nodes."); return false; }
        if(data.relCount >= Math.pow(2, 35)) { alert("There is currently a limit of 2^35 (~34B) relationships."); return false; }
        if(data.concurrentRequestsPerSecond <= 0) { if (!confirm("You have not provided a concurrent requests estimate for your application. Are you sure you want to perform the calculation without considering load?")) return false; }
        return true;
    }
    function updateResult() {
        $("#numberOfServers").val(addCommas(data.numberOfServers));
        $("#numberOfCoresPerServer").val(addCommas(data.numberOfCoresPerServer));
        $("#amountOfRAM").val(addCommas(data.amountOfRAM));

        $("#nodeCount").val(addCommas(data.nodeCount));
        $("#relCount").val(addCommas(data.relCount));
        $("#relsPerNode").val(addCommas(data.relsPerNode));

        $("#dataBytesPerNode").val(addCommas(data.dataBytesPerNode));
        $("#dataBytesPerRel").val(addCommas(data.dataBytesPerRel));

        $("#concurrentRequestsPerSecond").val(addCommas(data.concurrentRequestsPerSecond));
        $("#totalUsers").val(addCommas(data.totalUsers));
        $("#visitsPerDayPerUser").val(addCommas(data.visitsPerDayPerUser));
        $("#averageRequestTime").val(addCommas(data.averageRequestTime));
    }

    function forceUpdateResult() {
        updateResult();
        if (!validate()) return;

        $("#calculate").val("Please wait").attr("disabled", "disabled");

        $.post('/wp-admin/admin-ajax.php', {action: "hwcalc", data: JSON.stringify({input: data})}, renderResult);
    }

    function renderResult(data, status, jqxhr) {
        $("#input").hide();
        $("#info").hide();

        var response = JSON.parse(data);
        console.log(response);
        if (response.error) {
          console.log(response.error);
            $("#error").show();
            location.hash = "#error";
            return;
        }

        $("#result").show();
        location.hash = "#result";

        for (var key in response.result) {
            $("#" + key).text(response.result[key]);
        }
        for (var key in response.input) {
            $("#input-" + key).text(response.input[key]);
        }
    }


    function stripCommas( str ) {
        return str.replace( /,/g, "" );
    }
    function stripLeadingZeroes( str ) {
        while ( str.charAt( 0 ) === '0' && str.length > 1 ) {
            str = str.substring( 1, str.length );
        }
        return str;
    }
    function parseSize(str) {
        if (!(typeof(str) === "string")) return str;
        if (str.length === 0) return 0;
        str = stripCommas( str );
        str = stripLeadingZeroes( str );
        var lastChar = str.charAt(str.length-1).toLowerCase();
        var restAsInt = parseFloat( str.substring( 0, str.length - 1 ) );
        var num;
        if (lastChar === 'k') {
            num = restAsInt * 1000;
        } else if (lastChar === 'm') {
            num = restAsInt * 1000000;
        } else if (lastChar === 'g' || lastChar === 'b') {
            num = restAsInt * 1000000000;
        } else {
            num = parseFloat(str);
        }
        if (num === NaN) return 0;
        if (num < 0) return 0;
        return num;
    }

    function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var intPart = x[0];
        var decimalPart = x.length > 1 ? '.' + x[1] : '';
        var regex = /(\d+)(\d{3})/;
        while (regex.test(intPart)) {
            intPart = intPart.replace(regex, '$1' + ',' + '$2');
        }
        return intPart + decimalPart;
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
})();
