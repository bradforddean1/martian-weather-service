// STORE
const STORE = {
    martianWeather: {
        at: [],
        pressure: [],
        wind: [],
    },
    earthWeather: {
        loaction: {
            address: "",
            lat: "0",
            lon: "0",
        },
        at: [],
        pressure: [],
        wind: [],
    },
};

const STATE = {
    isFarenheight: false,
    isMph: false,
    activemeasure: null, //"temp", "pres", "wind"
    // isSplashActive: false,
    dateStartPicker: null,
    dateEndPicker: null,
    getDate: function (offset = 0) {
        let date = new Date();
        date = new Date(date.getTime() - offset * (1000 * 60 * 60 * 24));
        const dd = ("0" + date.getDate()).toString().slice(-2);
        const mm = ("0" + (date.getMonth() + 1)).toString().slice(-2);
        const yyyy = date.getFullYear().toString();
        return yyyy.concat("-", mm, "-", dd);
    },
    getDateStart: function () {
        if (this.dateStartPicker) {
            return this.dateStartPicker.getDate(true);
        } else {
            return this.getDate(7);
        }
    },
    getDateEnd: function () {
        if (this.dateEndPicker) {
            return this.dateEndPicker.getDate(true);
        } else {
            return this.getDate();
        }
    },
    getNumDays: function () {
        start = new Date(this.getDateStart()).getTime();
        end = new Date(this.getDateEnd()).getTime();
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },
    chartCtx: null,
    chartLegend: null,
    location: "New York City",
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

function buildWindChartDataArr(planets) {
    const windCrtdataArr = { labels: [], earth: [], mars: [] };

    const windObjs = {
        earth: new WindRoseData(),
        mars: new WindRoseData(),
    };

    for (let i = 0; i < STATE.getNumDays(); i++) {
        for (let [planetName, planetData] of Object.entries(planets)) {
            if (
                windObjs[planetName][planetData[i].windDir] < planetData[i].avg
            ) {
                windObjs[planetName][planetData[i].windDir] = planetData[i].avg;
            }
        }

        // if (earth[planets.earth[i].windDir] < planets.earth[i].avg) {
        //     earth[planets.earth[i].windDir] = planets.earth[i].avg;
        // }
    }

    windCrtdataArr.mars = Object.values(windObjs.mars);
    windCrtdataArr.earth = Object.values(windObjs.earth);
    windCrtdataArr.labels = Object.keys(windObjs.earth);

    return windCrtdataArr;
}

function buildLineChartDataArr(planets, metric) {
    const lnCrtdataArr = {
        labels: [],
        earth: [],
        mars: [],
    };

    for (let i = 0; i < STATE.getNumDays(); i++) {
        lnCrtdataArr.labels.push(
            planets.earth[i].utc
                .getMonth()
                .toString()
                .concat(
                    "-",
                    planets.earth[i].utc.getDay(),
                    " vs. ",
                    planets.mars[i].sol
                )
        );
        for (let [planetName, planetData] of Object.entries(planets)) {
            if (planetData[i][metric]) {
                lnCrtdataArr[planetName].push(planetData[i][metric]);
            }
        }
    }

    return lnCrtdataArr;
}

function getChartData(measure) {
    /* Ask Matt about taking data strait from the DOM into function
     * Is this if statement relevant or silly?
     */

    const data = { labels: [], datasets: [] };

    // validate datatype from DOM
    if (measure != "at" && measure != "pressure" && measure != "wind") {
        return data;
    }

    const dataSrc = {
        mars: STORE.martianWeather[measure],
        earth: STORE.earthWeather[measure],
    };

    //If # of days retrieved are not = to the num days query, do not render this data set.
    Object.keys(dataSrc).forEach((planet) => {
        const len = STATE.getNumDays();
        if (dataSrc[planet].length < len) {
            for (let i = 0; i < len; i++) {
                dataSrc[planet].push({ Error: "Missing Days" });
            }
            /* TODO: add unrliable data error here */
        }
    });

    const metrics = ["avg"];

    let dataArr = null;
    if (measure == "wind") {
        dataArr = buildWindChartDataArr(dataSrc);
    } else {
        dataArr = buildLineChartDataArr(dataSrc, metrics);
    }

    data.labels = dataArr.labels;

    data.datasets.push({
        label: "mars",
        data: dataArr.mars,
        borderWidth: 1,
    });

    data.datasets.push({
        label: "earth",
        data: dataArr.earth,
        borderWidth: 1,
    });

    return data;
}

function pushMartianData(data) {
    for (i = 0, keys = Object.keys(data); i < keys.length - 2; i++) {
        try {
            STORE.martianWeather.at.push({
                sol: keys[i],
                utc: data[keys[i]].Last_UTC,
                avg: data[keys[i]].AT.av,
                high: data[keys[i]].AT.mx,
                low: data[keys[i]].AT.mn,
            });
        } catch (error) {
            console.log(error);
        }

        try {
            STORE.martianWeather.pressure.push({
                sol: keys[i],
                utc: data[keys[i]].Last_UTC,
                avg: data[keys[i]].PRE.av,
                high: data[keys[i]].PRE.mx,
                low: data[keys[i]].PRE.mn,
            });
        } catch (error) {
            console.log(error);
        }
        try {
            STORE.martianWeather.wind.push({
                utc: data[keys[i]].Last_UTC,
                avg: data[keys[i]].HWS.av,
                high: data[keys[i]].HWS.mx,
                low: data[keys[i]].HWS.mn,
                windDir: data[keys[i]].WD.most_common.compass_point,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

function degreesToBearing(deg) {
    switch (true) {
        case deg > 348.75 && deg <= 11.25:
            dir = "N";
            break;
        case deg > 11.25 && deg <= 33.75:
            dir = "NNE";
            break;
        case deg > 33.75 && deg <= 56.25:
            dir = "NE";
            break;
        case deg > 56.25 && deg <= 78.75:
            dir = "ENE";
            break;
        case deg > 78.75 && deg <= 101.25:
            dir = "E";
            break;
        case deg > 101.25 && deg <= 123.75:
            dir = "ESE";
            break;
        case deg > 123.75 && deg <= 146.25:
            dir = "SE";
            break;
        case deg > 146.25 && deg <= 168.75:
            dir = "SSE";
            break;
        case deg > 168.75 && deg <= 191.25:
            dir = "S";
            break;
        case deg > 191.25 && deg <= 213.75:
            dir = "SSW";
            break;
        case deg > 213.75 && deg <= 236.25:
            dir = "SW";
            break;
        case deg > 236.25 && deg <= 258.75:
            dir = "WSW";
            break;
        case deg > 258.75 && deg <= 281.25:
            dir = "W";
            break;
        case deg > 281.25 && deg <= 303.75:
            dir = "WNW";
            break;
        case deg > 303.75 && deg <= 326.25:
            dir = "NW";
            break;
        case deg > 326.25 && deg <= 348.75:
            dir = "NNW";
            break;
        default:
            dir = null;
            break;
    }
    return dir;
}

function pushTerranData(data) {
    for (i = 0; i < data.length; i++) {
        STORE.earthWeather.at.push({
            utc: new Date(data[i].date),
            avg: data[i].tavg,
            high: data[i].tmax,
            low: data[i].tmin,
        });
        STORE.earthWeather.pressure.push({
            utc: new Date(data[i].date),
            avg: data[i].pres,
        });
        STORE.earthWeather.wind.push({
            utc: new Date(data[i].date),
            avg: data[i].wspd,
            windDir: degreesToBearing(data[i].wdir),
        });
    }
}

//API Calls
function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(
        (key) => `${key}=${params[key]}`
    );
    return queryItems.join("&");
}

function geolocate(location) {
    let params = {
        address: encodeURI(location),
        key: "AIzaSyBDJyedOS2VN3Fxz4eutyeM1_grLUQfp7s",
    };

    params = formatQueryParams(params);

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .catch((err) => console.log(err));
}

function fetchMartianData() {
    const start = STATE.getDateStart();
    const end = STATE.getDateEnd();

    //prettier-ignore
    let params = { 
        api_key: "DEMO_KEY", 
        feedtype: "json", 
        ver: "1.0", 
    };

    params = formatQueryParams(params);

    return fetch(`https://api.nasa.gov/insight_weather/?${params}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(
                "Failed to retrieve Martian data from the NASA Insight program"
            );
        })
        .then((response) => {
            // for (let [key, value] of Object.keys(response)) {
            //     if (moment.utc(value.Last_UTC).isAfter(end)) {
            //         // filteredResponse.push(response[key]);
            //     }
            // }

            return response;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
}

function fetchTerranData() {
    const headers = new Headers();
    headers.append("x-api-key", "BXfdILEuBoXF0cB2NIrZVc5ileNAC4lW");
    headers.append("Access-Control-Allow-Origin", "*");

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    let params = {
        lat: STORE.earthWeather.loaction.lat,
        lon: STORE.earthWeather.loaction.lon,
        alt: 336,
        start: STATE.getDateStart(),
        end: STATE.getDateEnd(),
    };

    params = formatQueryParams(params);

    return fetch(
        `https://cors-anywhere.herokuapp.com/https://api.meteostat.net/v2/point/daily?${params}`,
        requestOptions
    )
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(
                "Failed to retrieve terran data from weather service."
            );
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
}

function refreshDataArr() {
    for (let [planetName, planetData] of Object.entries(STORE)) {
        Object.keys(planetData).forEach((measure) => {
            STORE[planetName][measure].length = 0;
        });
    }
}

function dataFetch() {
    const location = STATE.location;

    const terranRequest = geolocate(location).then((responseJson) => {
        STORE.earthWeather.loaction.lat =
            responseJson.results[0].geometry.location.lat;
        STORE.earthWeather.loaction.lon =
            responseJson.results[0].geometry.location.lng;
        STORE.earthWeather.loaction.address =
            responseJson.results[0].formatted_address;
        return fetchTerranData(location);
    });

    const martianRequest = fetchMartianData();

    return [martianRequest, terranRequest];
}

function updateData() {
    refreshDataArr();

    response = dataFetch();

    return Promise.all(response).then(function (values) {
        if (values[0]) {
            pushMartianData(values[0]);
        } else {
            //Report Error to User
        }
        console.log(Object.keys(values[1]));
        if (values[1]) {
            pushTerranData(values[1].data);
        } else {
            //Report Error to User
        }
        return 0;
    });
}

// Render
function renderChart(measure) {
    const data = getChartData(measure);
    const ctx = STATE.chartCtx;

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
            display: measure == "wind" ? false : true,
            position: "bottom",
        },

        legendCallback: function (chart) {
            let text = [];
            text.push("<ul>");
            for (let i = 0; i < chart.data.datasets.length; i++) {
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

    const chart = new Chart(ctx, {
        data: data,
        type: measure == "wind" ? "polarArea" : "line",
        options: options,
    });

    // Generate HTML legend
    STATE.chartLegend.html(chart.generateLegend());
}

function renderData() {
    measure = STATE.activemeasure;
    renderChart(measure);

    //Desktop will need to render multiple charts.
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
        <div class="background-graphic">
            <div class="wrapper">
                <div class="padded-container">
                    <p>
                        Compare your local weather to the weather at Elysium
                        Planitia, Mars.
                    </p>
                    <form id="js-comp-earth-to-mars" class="container ctr-stacked" action="sumbit">
                        <label for="location">Select a location</label>
                        <input type="text" name="location" id="js-location-selector" required>
                        <button type="submit">Compare to Mars</button>
                    </form>
                </div>
            </div>
        </div>`);

    // <select name="location" id="location-selector" required>
    //     <option value="nyc">New York City</option>
    //     <option value="la">Los Angeles</option>
    // </select>
}

function render() {
    measure = STATE.activemeasure;
    if (measure) {
        const html = $("#js-content-wrapper").html(
            `
            <div class ="wrapper">
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
                                <div>
                                    <input type="text" class="form-control sr-only js-start-picker">
                                    <div class="js-start-picker-container"></div>
                                </div>
                                <div>
                                    <input type="text" class="form-control sr-only js-end-picker">
                                    <div class="js-end-picker-container"></div>
                                </div>
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
                        class="js-measure-selector"
                        data-measure="at"
                    ></button>
                    <button
                        type="button"
                        class="js-measure-selector"
                        data-measure="pressure"
                    ></button>
                    <button
                        type="button"
                        class="js-measure-selector"
                        data-measure="wind"
                    ></button>
                </div>
            </div>`
        );

        // Render the date Pickers
        STATE.dateStartPicker = new Picker(
            document.querySelector(".js-start-picker"),
            {
                container: ".js-start-picker-container",
                inline: true,
                rows: 1,
                date: STATE.getDateStart(),
                format: "YYYY-MM-DD",
            }
        );

        STATE.dateEndPicker = new Picker(
            document.querySelector(".js-end-picker"),
            {
                container: ".js-end-picker-container",
                inline: true,
                rows: 1,
                date: STATE.getDateEnd(),
                format: "YYYY-MM-DD",
                align: "right",
            }
        );

        //Render the Chart
        STATE.chartCtx = $(html).find("#myChart")[0].getContext("2d");
        STATE.chartLegend = $(html).find("#legend");
        renderData();
    } else {
        renderSplash();
    }
}

$(render());

// Listeners

(function () {
    //watch compare
    $("#js-content-wrapper").on("submit", "#js-comp-earth-to-mars", function (
        e
    ) {
        e.preventDefault();
        STATE.location = $("#js-location-selector").val();
        updateData().then(() => {
            STATE.activemeasure = "at";
            render();
        });
    });

    // return;

    //watch measure
    $("#js-content-wrapper").on("click", ".js-measure-selector", function (e) {
        e.preventDefault();
        const measure = $(this).attr("data-measure");
        STATE.activemeasure = measure;
        renderData();
    });

    // watch go
    $("#js-content-wrapper").on("click", "#js-go", function (e) {
        e.preventDefault();
        updateData().then(() => {
            renderData();
        });
    });

    //watch legend call back items
    $("#js-content-wrapper").on("click", ".js-legend-item", function (e) {
        e.preventDefault();
        legendClickCallback(e);
    });
})();

/* Maybe Matt can help walk through this */

function legendClickCallback(event) {
    event = event || window.event;

    var target = event.target || event.srcElement;
    while (target.nodeName !== "li") {
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

(function watchlegendItems() {})();
