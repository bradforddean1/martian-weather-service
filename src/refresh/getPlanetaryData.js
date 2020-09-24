import defaultPlanetaryData from "./defaultPlanetaryData";
import fetchMartianData from "../api/fetchMartianData";
import fetchTerranData from "../api/fetchTerranData";

/**
 * Calls refreshDataArr, fetchMartianData, fetchTerranData, pushMartianData, and, pushTerranData to clear the STORE< onject, obtain frsh data from teran and earth API, and repopulate store with API data.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @return {Promise} Promise object with response data from the server
 *
 */
async function getPlanetaryData(geoData, dateRange) {
    const planetaryData = {
        martian: Object.assign({}, defaultPlanetaryData),
        terran: Object.assign({}, defaultPlanetaryData),
    };

    // const response = [fetchMartianData(), fetchTerranData(dateRange)];

    const martianData = fetchMartianData();
    const terranData = fetchTerranData(geoData, dateRange);

    if (await martianData) {
        console.log("martian", martianData);
        planetaryData.martian = martianData;
    }
    if (await terranData) {
        console.log("terran", terranData);
        planetaryData.martian = terranData;
    }

    // Promise.all(response).then(function (values) {
    //     if (values[0]) {
    //         console.log('martian', values[0])
    //         // planetaryData.martian(values[0]);
    //     }
    //     if (values[1]) {
    //         console.log('terran', values[1].data)
    //         // planetaryData.terran(values[1].data);
    //     }
    // });

    return planetaryData;
}

export default getPlanetaryData;
