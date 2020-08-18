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
