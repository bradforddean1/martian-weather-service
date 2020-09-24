import formatQueryParams from "../utils/formatQueryParams";

/**
 * Fetches Martian weather data from NASA insight API https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @return {Promise} Promise object with response data from the server
 *
 */
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
            STORE.apiError.push(err);
            return false;
        });
}

export default fetchMartianData;
