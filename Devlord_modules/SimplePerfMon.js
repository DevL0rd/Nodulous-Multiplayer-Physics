//Performance Monitoring Module
//Author Name: Dustin Harris
//Work Email:duharris@ebay.com
//Personal Email:dmhzmxn@gmail.com
//*********************************
//
//
var os = require('os');
var MaxHistoryLength = 30
function round(value, decimals) {
    //This rounds a decimal by the specified number of decmial places
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

var Memory = {
    "Size": function (Unit) {
        var Result
        if (Unit == "B") {
            Result = os.totalmem()
        } else if (Unit == "KB") {
            Result = os.totalmem() / 1000
        } else if (Unit == "MB") {
            Result = os.totalmem() / 1000000
        } else if (Unit == "GB") {
            Result = os.totalmem() / 1000000000
        }
        return Result
    },
    "Usage": function (Unit) {
        var Result
        var UsedMem = this.UsageHistory[this.UsageHistory.length - 1]
        if (Unit == "B") {
            Result = UsedMem
        } else if (Unit == "KB") {
            Result = UsedMem / 1000
        } else if (Unit == "MB") {
            Result = UsedMem / 1000000
        } else if (Unit == "GB") {
            Result = UsedMem / 1000000000
        }
        return Result
    },
    "Free": function (Unit) {
        var Result
        if (Unit == "B") {
            Result = os.freemem()
        } else if (Unit == "KB") {
            Result = os.freemem() / 1000
        } else if (Unit == "MB") {
            Result = os.freemem() / 1000000
        } else if (Unit == "GB") {
            Result = os.freemem() / 1000000000
        }
        return Result
    }, "PollUsage": function () {
        var Result = (os.totalmem() - os.freemem())
        this.UsageHistory.push(Result)
        if (this.UsageHistory.length > MaxHistoryLength) {
            this.UsageHistory = this.UsageHistory.slice(1, this.UsageHistory.length)
        }
        return Result
    },
    "UsageHistory": []
}
var Cpu = {
    "startMeasure": cpuAverage(),
    "PollUsage": function () {
        var Result = 0
        var endMeasure = cpuAverage();
        //Calculate the difference in idle and total time between the measures
        var idleDifference = endMeasure.idle - this.startMeasure.idle;
        var totalDifference = endMeasure.total - this.startMeasure.total;
        //Calculate the average percentage CPU usage
        Result = 100 - ~~(100 * idleDifference / totalDifference);
        this.UsageHistory.push(Result)
        if (this.UsageHistory.length > MaxHistoryLength) {
            this.UsageHistory = this.UsageHistory.slice(1, this.UsageHistory.length)
        }
        //Grab first CPU Measure
        this.startMeasure = cpuAverage();
        return Result
    },
    "UsageHistory": [],
    "Usage": function () {
        var Result = this.UsageHistory[this.UsageHistory.length - 1]
        return Result
    },
    "Count": function () {
        var Result = os.cpus().length
        return Result
    }
}
function cpuAverage() {

    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();

    //Loop through CPU cores
    for (var i = 0, len = cpus.length; i < len; i++) {

        //Select CPU core
        var cpu = cpus[i];

        //Total up the time in the cores tick
        for (type in cpu.times) {
            totalTick += cpu.times[type];
        }

        //Total up the idle time of the core
        totalIdle += cpu.times.idle;
    }

    //Return the average Idle and Tick times
    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

setInterval(function () {
    Cpu.PollUsage()
    Memory.PollUsage()
}, 1000)
//List all public objects
exports.Cpu = Cpu;
exports.Memory = Memory;