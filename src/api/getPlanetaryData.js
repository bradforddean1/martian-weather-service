import defaultPlanetaryData from "./defaultPlanetaryData";
import formatQueryParams from "../utils/formatQueryParams";

/**
 * Queries server for martian and terrran data of specified time range and earth locaiton.
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @params
 * @return {Promise} Promise object with response data from the server
 *
 */
async function getPlanetaryData(geoData, dateRange) {
    let planetaryData = [];

    //prettier-ignore
    let params = {
        lat: "6",
        lon: "7",
        dateStart: "09/26/2020",
        dateEnd: "09/20/2020",
    };

    params = formatQueryParams(params);
    const res = fetch(`http://localhost:8080/weather-data/?${params}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Failed to retrieve weather data from server");
        })
        .catch((err) => {
            // STORE.apiError.push(err);
            return false;
        });

    if (await res) {
        planetaryData = res;
    }

    return planetaryData;
}

export default getPlanetaryData;
