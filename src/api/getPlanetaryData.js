import defaultPlanetaryData from "./defaultPlanetaryData";
import formatQueryParams from "../utils/formatQueryParams";

/**
 * Calls refreshDataArr, retieves MartianData and TerranData from server with fetch API call.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @return {Promise} Promise object with response data from the server
 *
 */
async function getPlanetaryData(geoData, dateRange) {
    const planetaryData = Object.assign({}, defaultPlanetaryData);

    //prettier-ignore
    let params = {
        api_key: "JRPWKpyWr5JcEdUsLMypoII5iBeMaSn1Oy94DnkF",
        feedtype: "json",
        ver: "1.0",
    };

    params = formatQueryParams(params);

    const res = fetch(`https://api.nasa.gov/insight_weather/?${params}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(
                "Failed to retrieve Martian data from the NASA Insight program"
            );
        })
        .catch((err) => {
            STORE.apiError.push(err);
            return false;
        });

    if (await res) {
        console.log(res);
        planetaryData = res;
    }

    return planetaryData;
}

export default getPlanetaryData;
