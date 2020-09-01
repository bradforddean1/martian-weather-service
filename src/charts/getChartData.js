/**
 * Collects data from the STORE variable using getDataByMeasure method to generate the datasets.
 * Formats and returns the data into the labels and datasets arrays required to generate a chart with the ChartJS api.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @param {string} measure – String indicating the type measure being charted, i.e. temperature(at), air pressure(pressure), or wind behavior(wind).
 * @return {Object} Object containing two arrays: {labels, datasets}.
 *
 */
function getChartData(measure, dateRange) {
    const data = { labels: [], datasets: [] };

    // validate datatype from DOM
    if (measure != "at" && measure != "pressure" && measure != "wind") {
        return data;
    }

    const dataSrc = {
        mars: STORE.getDataByMeasure(measure, "martianWeather"),
        earth: STORE.getDataByMeasure(measure, "earthWeather"),
    };

    //If # of days retrieved are not = to the num days query, do not render this data set.
    Object.keys(dataSrc).forEach((planet) => {
        const len = dateRange.getNumDays();
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
        dataArr = buildWindChartDataArr(dataSrc, dateRange);
    } else {
        dataArr = buildLineChartDataArr(dataSrc, metrics, dateRange);
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
