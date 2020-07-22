// STORE
const STORE = {
    martianWeather: {
        at: [],
        pressure: [],
        wind: [],
    },
    earthWeather: {
        location: {
            address: "",
            lat: "0",
            lon: "0",
        },
        at: [],
        pressure: [],
        wind: [],
    },

    getAverage: function (planet, measure) {
        if (measure != "at" && measure != "pressure") {
            return "-";
        }

        if (planet != "martianWeather" && planet != "earthWeather") {
            return "-";
        }

        let total = 0;
        let count = 0;
        for (const rot of this[planet][measure]) {
            if (rot.avg) {
                total += rot.avg;
                count += 1;
            } else {
                return "-";
            }
        }

        return Math.round(total / count).toString();
    },
    getMax: function (planet, measure) {
        if (measure != "at" && measure != "pressure") {
            return "-";
        }

        if (planet != "martianWeather" && planet != "earthWeather") {
            return "-";
        }

        const all = [];
        for (const rot of this[planet][measure]) {
            if (rot.high) {
                all.push(rot.high);
            } else {
                return "-";
            }
        }
        return Math.round(Math.max(...all)).toString();
    },
    getMin: function (planet, measure) {
        if (measure != "at" && measure != "pressure") {
            return "-";
        }

        if (planet != "martianWeather" && planet != "earthWeather") {
            return "-";
        }

        const all = [];
        for (const rot of this[planet][measure]) {
            if (rot.low) {
                all.push(rot.low);
            } else {
                return "-";
            }
        }

        return Math.round(Math.min(...all)).toString();
    },
};

const STATE = {
    isFarenheight: false,
    isMph: false,
    activemeasure: null, //"temp", "pres", "wind"
    // isSplashActive: false,
    dateStart: null,
    dateEnd: null,
    solStart: null,
    solEnd: null,
    setDateStart: function (date) {
        this.dateStart = moment(date);
        this.solStart =
            this.utcToMartianDate(moment(this.getDateEnd("YYYY-MM-DD"))) -
            this.getNumDays();
    },
    setDateEnd: function (date) {
        this.dateEnd = moment(date);
        this.solEnd = this.utcToMartianDate(this.dateEnd);
    },
    getSolStart: function () {
        if (!this.solStart) {
            this.solStart =
                this.utcToMartianDate(moment(this.getDateEnd("YYYY-MM-DD"))) -
                this.getNumDays();
        } else {
            return this.solStart;
        }
    },
    getSolEnd: function () {
        if (!this.solEnd) {
            this.solEnd = this.utcToMartianDate(this.dateEnd);
        }
        return this.solEnd;
    },
    getDateStart: function (format) {
        if (this.dateStart) {
            return this.dateStart.format(format);
        } else {
            const date = moment().subtract(7, "days");
            this.dateStart = date;
            return date.format(format);
        }
    },
    getDateEnd: function (format) {
        if (this.dateEnd) {
            return this.dateEnd.format(format);
        } else {
            const date = moment();
            this.dateEnd = date;
            return date.format(format);
        }
    },
    getNumDays: function () {
        diffDays = this.dateEnd.diff(this.dateStart, "days");
        return diffDays;
    },
    utcToMartianDate: function (utc) {
        const beginTimeKeep = moment("2018-11-26");
        const sol = Math.abs(beginTimeKeep.diff(utc, "days")) / 1.0274912517;
        return Math.floor(sol);
    },
    chartCtx: null,
    chartLegend: null,
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

    function getSol(i) {
        if (!planets.mars[i].sol) {
            return "na";
        }

        return planets.mars[i].sol;
    }

    for (let i = 0; i < STATE.getNumDays(); i++) {
        lnCrtdataArr.labels.push(
            STATE.getDateStart("M-D").toString().concat(" vs. ", getSol(i))
            //get UTC from and compare to range...
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
            /* TODO: add unreliable data error here */
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
        backgroundColor: "rgba(192, 77, 15, 0.3)",
        borderColor: "#FF6700",
        pointBackgroundColor: "#FF6700",
    });

    data.datasets.push({
        label: "earth",
        data: dataArr.earth,
        borderWidth: 1,
        backgroundColor: "rgba(0, 77, 201, 0.3)",
        borderColor: "#004DC9",
        pointBackgroundColor: "#2C7BFA",
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
    //prettier-ignore
    let params = { 
        api_key: "JRPWKpyWr5JcEdUsLMypoII5iBeMaSn1Oy94DnkF", 
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
    // headers.append("Access-Control-Allow-Origin", "*");

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    let params = {
        lat: STORE.earthWeather.location.lat,
        lon: STORE.earthWeather.location.lon,
        alt: 336,
        start: STATE.getDateStart("YYYY-MM-DD"),
        end: STATE.getDateEnd("YYYY-MM-DD"),
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
    const location = STORE.earthWeather.location.address;

    const terranRequest = geolocate(location).then((responseJson) => {
        STORE.earthWeather.location.lat =
            responseJson.results[0].geometry.location.lat;
        STORE.earthWeather.location.lon =
            responseJson.results[0].geometry.location.lng;
        STORE.earthWeather.location.address =
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
        legend: {
            display: measure == "wind" ? false : true,
            position: "bottom",
        },

        legendCallback: function (chart) {
            //chart.data.datasets.length
            return `<table>
                        <thead>
                            <th></td>
                            <th>min</td>
                            <th>avg</td>
                            <th>max</td>
                        </thead>
                        <tr class="mars">
                            <th class="js-legend-item"${console.log(
                                chart
                            )}>mars</td>
                            <td>${STORE.getMin("martianWeather", measure)}</td>
                            <td>${STORE.getAverage(
                                "martianWeather",
                                measure
                            )}</td>
                            <td>${STORE.getMax("martianWeather", measure)}</td>
                        </tr>
                        <tr class = "earth">
                            <th class="js-legend-item">earth</td>
                            <td>${STORE.getMin("earthWeather", measure)}</td>
                            <td>${STORE.getAverage(
                                "earthWeather",
                                measure
                            )}</td>
                            <td>${STORE.getMax("earthWeather", measure)}</td>
                        </tr>
                    </table>`;
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
    const measure = STATE.activemeasure;

    function getUnitContainer() {
        if (measure == "at") {
            return `
            <div class="container unit">
                <button class="left">°C</button>
                <button class="right">°F</button>
            </div>`;
        }
        if (measure == "pressure") {
            return `
            <div class="container unit">
                <button>hPh</button>
            </div>`;
        }
        if (measure == "wind") {
            return `
            <div class="container unit">
                <button class="left">kPh</button>
                <button class="right">mPh</button>
            </div>`;
        }
    }

    return `
        <div class='container graph'>
            <span>
            ${STATE.getDateStart("M/D/YY")}
            -
            ${STATE.getDateEnd("M/D/YY")}
            </span>
            ${getUnitContainer()}
            <canvas id="myChart"></canvas>
            <!-- width="400" height="400" -->
            <div class="legend" id="legend"></div>
        </div>`;
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
        <header class="bg-dark">
            <div class="container">
                <h1>Martian Weather Service</h1>
            </div>
        </header>
        <hr>
        <main class="container fill">
            <div class="graphic-back fill">
                <div class="gradient-back"></div>
                <div class="wrapper">
                    <form id="js-comp-earth-to-mars" class="container splash-content action="sumbit">
                        <div class="container vbox">
                            <p class="splash-summary">
                                Compare your local weather to the weather at Elysium
                                Planitia, Mars.
                            </p>
                            <input type="text" name="location" id="js-location-selector" placeholder="Type a location..." required>
                        </div>
                        <button type="submit">Compare to Mars</button>
                    </form>
                </div>
            </div>
        </main>    
    `);

    // <select name="location" id="location-selector" required>
    //     <option value="nyc">New York City</option>
    //     <option value="la">Los Angeles</option>
    // </select>
}

function render() {
    measure = STATE.activemeasure;

    function isMobNavButSelect(option, element) {
        if (option == STATE.activemeasure) {
            if (element == "button") {
                return "mobnav-button-selected";
            }
            if (element == "span") {
                return "mobnav-span-selected";
            }
        }
        return "";
    }

    if (measure) {
        const html = $("#js-content-wrapper").html(
            `
            <header class="bg-dark">
                <div class="container">
                    <h2><span class="caption">comparing to:</span>${
                        STORE.earthWeather.location.address
                    }</h2>
                </div>
            </header>
            <main>
                <div class ="wrapper">
                    <div class="container date-selector">
                        <h3>Select Date Range:</h3>
                        <form
                            id="js-date-picker"
                            class="container ctr-justified"
                            action="submit"
                        >
                            <div class="container date-range-picker">
                                <div class="container date-picker">
                                    <input
                                        type="date"
                                        name="start-date"
                                        id="js-start-date"
                                        class="js-date-selector"
                                        value="${STATE.getDateStart(
                                            "YYYY-MM-DD"
                                        )}"
                                        max="${moment().format("YYYY-MM-DD")}"
                                        min="${moment()
                                            .subtract(6, "days")
                                            .format("YYYY-MM-DD")}"
                                    />
                                    <span 
                                        class="sol" 
                                        id="js-sol-start"
                                    >Sol ${STATE.getSolStart()}
                                    </span>
                                </div>
                                <div class="container date-picker">
                                    <input
                                        type="date"
                                        name="end-date"
                                        id="js-end-date"
                                        class="js-date-selector"
                                        value="${STATE.getDateEnd(
                                            "YYYY-MM-DD"
                                        )}"
                                        max="${moment().format("YYYY-MM-DD")}"
                                        min="${moment()
                                            .subtract(6, "days")
                                            .format("YYYY-MM-DD")}"
                                    />
                                    <span 
                                        class="sol"
                                        id="js-sol-end"
                                    >Sol ${STATE.getSolEnd()}
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                    ${renderData()}
                    <div class="mobile-nav">
                        <div class="container-back"></div>
                        <div class="container">
                            <div class="bbox" >
                                <button
                                    type="button"
                                    class="js-measure-selector ${isMobNavButSelect(
                                        "at",
                                        "button"
                                    )}"
                                    data-measure="at"
                                ></button>
                                <span class="${isMobNavButSelect(
                                    "at",
                                    "span"
                                )}">°C/°F</span>
                            </div>
                            <div class="bbox">
                                <button
                                    type="button"
                                    class="js-measure-selector ${isMobNavButSelect(
                                        "pressure",
                                        "button"
                                    )}"
                                    data-measure="pressure"
                                ></button>
                                <span class="${isMobNavButSelect(
                                    "pressure",
                                    "span"
                                )}">hPa</span>
                            </div>
                            <div class="bbox">
                                <button
                                    type="button"
                                    class="js-measure-selector ${isMobNavButSelect(
                                        "wind",
                                        "button"
                                    )}"
                                    data-measure="wind"
                                ></button>
                                <span class="${isMobNavButSelect(
                                    "wind",
                                    "span"
                                )}">Wind</span>
                            </div>    
                        </div>
                    </div>
                </div>
            </main>`
        );

        STATE.chartCtx = $(html).find("#myChart")[0].getContext("2d");
        STATE.chartLegend = $(html).find("#legend");

        renderChart(measure); //Desktop will need to render multiple charts.
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
        STORE.earthWeather.location.address = $("#js-location-selector").val();
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
        render();
    });

    // watch daterange
    $("#js-content-wrapper").on("change", ".js-date-selector", function (e) {
        STATE.setDateStart($("#js-start-date").val());
        STATE.setDateEnd($("#js-end-date").val());

        updateData().then(() => {
            render();
        });
    });

    //watch legend call back items
    $("#js-content-wrapper").on("click", ".js-legend-item", function (e) {
        e.preventDefault();
        legendClickCallback(e);
        alert("hello");
    });
})();

/* Maybe Matt can help walk through this */

function legendClickCallback(event) {
    event = event || window.event;

    var target = event.target || event.srcElement;
    while (target.nodeName !== "th") {
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
