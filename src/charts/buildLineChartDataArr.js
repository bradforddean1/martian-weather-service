function buildLineChartDataArr(planets, metric, measure) {
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

    for (
        let i = 0, date = moment(STATE.getDateStart());
        i < STATE.getNumDays();
        i++
    ) {
        lnCrtdataArr.labels.push(
            date.format("M-D").toString().concat(" vs. ", getSol(i))
            //get UTC from and compare to range...
        );

        for (let [planetName, planetData] of Object.entries(planets)) {
            lnCrtdataArr[planetName].push(planetData[i][metric]);
        }

        date.add(1, "days");
    }

    return lnCrtdataArr;
}
