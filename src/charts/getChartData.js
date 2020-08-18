function getChartData(measure) {
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
        dataArr = buildLineChartDataArr(dataSrc, metrics, measure);
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
