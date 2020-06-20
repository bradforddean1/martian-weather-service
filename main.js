// STORE
const STORE = {
    martianWeather: {
        at: [
            // { dd: "252", avg: 55, high: 33, low: 12 },
            // { dd: "253", avg: 155, high: 133, low: 112 },
            // { dd: "254", avg: 155, high: 133, low: 112, windDir: "SSW" },
        ],

        pressure: [
            // { dd: "252", avg: 10, high: 22, low: 32 },
            // { dd: "253", avg: 255, high: 333, low: 112 },
            // { dd: "254", avg: 155, high: 133, low: 112, windDir: "SSW" },
        ],
        wind: [
            // { dd: "252", avg: 15, high: 31, low: 12 },
            // { dd: "253", avg: 155, high: 133, low: 412 },
            // { dd: "254", avg: 155, high: 133, low: 112, windDir: "SNW" },
        ],
    },
    earthWeather: {
        at: [
            { dd: "252", avg: 55, high: 33, low: 12 },
            { dd: "253", avg: 355, high: 333, low: 312 },
            { dd: "254", avg: 155, high: 133, low: 112 },
        ],
        pressure: [
            { dd: "252", avg: 20, high: 22, low: 22 },
            { dd: "253", avg: 255, high: 333, low: 112 },
            { dd: "254", avg: 155, high: 133, low: 112 },
        ],
        wind: [
            { dd: "252", avg: 15, high: 31, low: 12, windDir: "NSW" },
            { dd: "253", avg: 155, high: 133, low: 412, windDir: "SNW" },
            { dd: "254", avg: 155, high: 113, low: 111, windDir: "SNW" },
        ],
    },
};

const STATE = {
    isFarenheight: false,
    isMph: false,
    activeMetric: "at", //"pres", "wind"
    // isSplashActive: false,
    dateStart: "06/04/2020",
    dateEnd: "06/05/2020",
};

class WindRoseData {
    N = 0;
    NNW = 0;
    NW = 0;
    WNW = 0;
    W = 0;
    WSW = 0;
    SW = 0;
    SSW = 0;
    S = 0;
    SSE = 0;
    SE = 0;
    ESE = 0;
    E = 0;
    ENE = 0;
    NE = 0;
    NNE = 0;
}

function buildWindChartDataArr(dataSrc) {
    const windCrtdataArr = { labels: [], earth: [], mars: [] };

    const earth = new WindRoseData();
    const mars = new WindRoseData();

    for (let i = 0; i < dataSrc.earth.length; i++) {
        if (mars[dataSrc.mars[i].windDir] < dataSrc.mars[i].avg) {
            mars[dataSrc.mars[i].windDir] = dataSrc.mars[i].avg;
        }

        if (earth[dataSrc.earth[i].windDir] < dataSrc.earth[i].avg) {
            earth[dataSrc.earth[i].windDir] = dataSrc.earth[i].avg;
        }
    }

    windCrtdataArr.mars = Object.values(mars);
    windCrtdataArr.earth = Object.values(earth);
    windCrtdataArr.labels = Object.keys(earth);

    return windCrtdataArr;
}

function buildLineChartDataArr(dataSrc) {
    const lnCrtdataArr = { labels: [], earth: [], mars: [] };

    for (let i = 0; i < dataSrc.earth.length; i++) {
        lnCrtdataArr.labels.push(
            dataSrc.earth[i].dd.concat("-", dataSrc.mars[i].dd)
        );
        lnCrtdataArr.mars.push(dataSrc.mars[i].avg);
        lnCrtdataArr.earth.push(dataSrc.earth[i].avg);
    }

    return lnCrtdataArr;
}

function getChartData(metric) {
    /* Ask Matt about taking data strait from the DOM into function
     * Is this if statement relevant or silly?
     */

    const data = { labels: [], datasets: [] };

    // validate datatype from DOM
    if (metric != "at" && metric != "pressure" && metric != "wind") {
        return data;
    }

    const dataSrc = {
        mars: STORE.martianWeather[metric],
        earth: STORE.earthWeather[metric],
    };

    // if (dataSrc.earth.length != dataSrc.mars.length) {
    //     return dataSets;
    // }
    let rawData = null;
    if (metric == "wind") {
        rawData = buildWindChartDataArr(dataSrc);
    } else {
        rawData = buildLineChartDataArr(dataSrc);
    }

    data.labels = rawData.labels;

    data.datasets.push({
        label: "mars",
        data: rawData.mars,
        borderWidth: 1,
    });

    // data.datasets.push({
    //     label: "earth",
    //     data: rawData.earth,
    //     borderWidth: 1,
    // });

    return data;
}

function pushMartianData(ResponseJson) {
    for (i = 0, keys = Object.keys(ResponseJson); i < keys.length - 2; i++) {
        STORE.martianWeather.at.push({
            dd: keys[i],
            avg: ResponseJson[keys[i]].AT.av,
            high: ResponseJson[keys[i]].AT.mx,
            low: ResponseJson[keys[i]].AT.mn,
        });
        STORE.martianWeather.pressure.push({
            dd: keys[i],
            avg: ResponseJson[keys[i]].PRE.av,
            high: ResponseJson[keys[i]].PRE.mx,
            low: ResponseJson[keys[i]].PRE.mn,
        });
        STORE.martianWeather.wind.push({
            avg: ResponseJson[keys[i]].HWS.av,
            high: ResponseJson[keys[i]].HWS.mx,
            low: ResponseJson[keys[i]].HWS.mn,
            windDir: ResponseJson[keys[i]].WD.most_common.compass_point,
        });
    }
}

//API Calls
function fetchMartianData() {
    return (
        fetch(
            "https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0"
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            // .then((responseJson) => pushMartianData(responseJson))
            .catch((err) => console.log(err))
    );
}

function fetchTerranData() {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "BXfdILEuBoXF0cB2NIrZVc5ileNAC4lW");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch(
        "https://api.meteostat.net/v2/point/daily?lat=33.749&lon=-84.388&alt=336&start=2020-06-01&end=2020-06-18",
        requestOptions
    )
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        // .then((responseJson) => pushMartianData(responseJson))
        .catch((err) => console.log(err));
}

// Render
function renderChart(ctx, data, metric) {
    const options = {
        // scales: {
        //     yAxes: [
        //         {
        //             ticks: {
        //                 beginAtZero: false,
        //             },
        //         },
        //     ],
        // },

        legend: {
            display: metric == "wind" ? false : true,
            position: "bottom",
        },

        legendCallback: function (chart) {
            var text = [];
            text.push("<ul>");
            for (var i = 0; i < chart.data.datasets.length; i++) {
                text.push(`<li class="js-legend-item>"`);
                text.push(
                    '<span style="background-color:' +
                        chart.data.datasets[i].borderColor +
                        '">' +
                        chart.data.datasets[i].label +
                        "</span>"
                );
                text.push("</li>");
            }
            text.push("</ul>");
            return text.join("");
        },
    };

    return new Chart(ctx, {
        data: data,
        type: metric == "wind" ? "polarArea" : "line",
        options: options,
    });
}

function renderWindRose(ctx, data) {
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    new Chart(ctx, {
        data: data,
        type: "polarArea",
        options: options,
    });
}

function renderSplash() {
    $("#js-content-wrapper").html(`
        <div class="padded-container">
            <p>
                Compare your local weather to the weather at Elysium
                Planitia, Mars.
                    </p>
            <form id="js-comp-earth-to-mars" class="container ctr-stacked" action="sumbit">
                <label for="location">Select a location</label>
                <select name="location" id="location-selector" required>
                    <option value="nyc">New York City</option>
                    <option value="la">Los Angeles</option>
                </select>
                <button type="submit">Compare to Mars</button>
            </form>
        </div>`);
}

function render(metric = null) {
    if (metric) {
        const html = $("#js-content-wrapper").html(
            `
            <div>
                    <div class="bg-med padded-container">
                        <h2>Select Date:</h2>
                        <form
                            id="js-date-picker"
                            class="container ctr-justified"
                            action="submit"
                        >
                            <div>
                                <div class="container date-picker">
                                    <label for="date-range">Date</label>
                                    <fieldset name="date-range">
                                        <input
                                            type="date"
                                            name="start-date"
                                            id="js-start-date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                        />

                                        <input
                                            type="date"
                                            name="end-date"
                                            id="js-end-date"
                                            pattern="\d{4}-\d{2}-\d{2}"
                                        />
                                    </fieldset>
                                </div>
                                <div class="container date-picker">
                                    <label for="date-range">Sol</label>
                                    <fieldset name="date-range">
                                        <input
                                            type="date"
                                            name="start-date"
                                            id="js-start-date"
                                            disabled
                                        />

                                        <input
                                            type="date"
                                            name="end-date"
                                            id="js-end-date"
                                            disabled
                                        />
                                    </fieldset>
                                </div>
                            </div>
                            <button id="js-go" type="submit">
                                go
                            </button>
                        </form>
                    </div>
                    <div class="bg-light">
                        <div class="container ctr-center-content">
                            <button>°C</button>
                            <button>°F</button>
                        </div>
                        <canvas id="myChart"></canvas>
                        <!-- width="400" height="400" -->
                        <div id="legend"></div>
                        <table>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <button
                            type="button"
                            class="js-metric-selector"
                            data-metric="at"
                        ></button>
                        <button
                            type="button"
                            class="js-metric-selector"
                            data-metric="pressure"
                        ></button>
                        <button
                            type="button"
                            class="js-metric-selector"
                            data-metric="wind"
                        ></button>
                    </div>
                </div>`
        );
        const data = getChartData(metric);
        const ctx = $(html).find("#myChart")[0].getContext("2d");
        const chart = renderChart(ctx, data, metric);

        // generate HTML legend
        $(html).find("#legend").html(chart.generateLegend());
    } else {
        renderSplash();
    }
}

$(render());

// Listeners

(function watchCompare() {
    $("#js-content-wrapper").on("click", "#js-comp-earth-to-mars", function (
        e
    ) {
        e.preventDefault();

        const apiRequest1 = fetchMartianData();
        const apiRequest2 = fetchTerranData();

        // const combinedData = { apiRequest1: {}, apiRequest2: {} };

        Promise.all([apiRequest1, apiRequest2]).then(function (values) {
            // combinedData["apiRequest1"] = values[0];
            // combinedData["apiRequest2"] = values[1];
            // return combinedData;
            pushMartianData(values[0]);
            pushMartianData(values[1]);
        });

        // fetchMartianData().then((data) => {
        //     pushMartianData(data);
        //     render("at");
        // });
    });

    return;
})();

(function watchMetric() {
    $("#js-content-wrapper").on("click", ".js-metric-selector", function (e) {
        e.preventDefault();
        const metric = $(this).attr("data-metric");
        STATE.activeMetric = metric;
        render(metric);
    });
})();

/* Maybe Matt can help walk through this */

function legendClickCallback(event) {
    event = event || window.event;

    var target = event.target || event.srcElement;
    while (target.nodeName !== "LI") {
        target = target.parentElement;
    }
    var parent = target.parentElement;
    var chartId = parseInt(parent.classList[0].split("-")[0], 10);
    var chart = Chart.instances[chartId];
    var index = Array.prototype.slice.call(parent.children).indexOf(target);

    chart.legend.options.onClick.call(
        chart,
        event,
        chart.legend.legendItems[index]
    );
    if (chart.isDatasetVisible(index)) {
        target.classList.remove("hidden");
    } else {
        target.classList.add("hidden");
    }
}

(function watchlegendItems() {
    $("#js-content-wrapper").on("click", ".js-legend-item", function (e) {
        e.preventDefault();
        legendClickCallback(e);
    });
})();

//validate Location
//validate geoLaction via Geocode API
//render error intermodal
//else render Main Page starting temperture data.

//getEarthWeather
//fetch from api
//update store with weather info

// function watchLocation {}
//onclicke Event
//collect input
//call validate lcoation
//call getEarthWeather
//call getMarsWeather

//if validate weather false
//render error intermodal
//else
//render(temp)

//function watchTempUnit
//on click
//update store tempUnit

// iffe
// (function ($) {
//     $("#call_api").on("click", (e) => {
//         let promise = new Promise((res, rej) => {
//             $.ajax({
//                 headers: {
//                     accept: "application/json; odata=verbose",
//                 },
//                 type: "GET",
//                 url:
//                     "https: //api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0",
//                 success: (data) => {
//                     console.log(data);
//                     res();
//                 },
//                 error: (error) => {
//                     console.log(error);
//                     rej();
//                 },
//             });
//         });
//         return promise;
//     });
// })(window.jQuery);
