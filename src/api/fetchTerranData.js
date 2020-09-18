/**
 * Fetches local (earth) weather data from the meteostat api: https://dev.meteostat.net/#:~:text=Meteostat%20is%20an%20open%20platform,request%20your%20personal%20API%20key
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @return {Promise} Promise object with response data from the server
 *
 */
function fetchTerranData(dateRange) {
    const headers = new Headers();
    headers.append("x-api-key", "BXfdILEuBoXF0cB2NIrZVc5ileNAC4lW");
    // headers.append("Access-Control-Allow-Origin", "*");

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    let params = {
        lat: '40.7484',
        lon: '73.9857',
        alt: 336,
        start: '2020-09-17',
        end: '2020-09-10',
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
            STATE.apiError.push(err);
            return false;
        });
}

export default fetchTerranData;
