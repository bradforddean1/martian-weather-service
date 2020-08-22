/**
 * Generates 3 arrays of data points from input in format required for ChartJS dataset.
 * This function formats datpoints in manner approriate for a line/bar chart.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @param {object} planets – Earth and mars datasets to be formated.
 * @param {string} metric – String indicating metic data is collected form, i.e. avg, min, max..
 * @return {Object} Object containing three arrays: {earth, mars, labels}.
 *
 */
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

    for (
        let i = 0, date = moment(STATE.getDateStart());
        i < STATE.getNumDays();
        i++
    ) {
        lnCrtdataArr.labels.push(
            date.format("M-D").toString().concat(" vs. ", getSol(i))
        );

        for (let [planetName, planetData] of Object.entries(planets)) {
            lnCrtdataArr[planetName].push(planetData[i][metric]);
        }

        date.add(1, "days");
    }

    return lnCrtdataArr;
}

export default buildLineChartDataArr;
