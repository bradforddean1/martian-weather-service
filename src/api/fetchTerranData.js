function fetchTerranData() {
    const headers = new Headers();
    headers.append("x-api-key", "BXfdILEuBoXF0cB2NIrZVc5ileNAC4lW");
    // headers.append("Access-Control-Allow-Origin", "*");

    const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
    };

    let params = {
        lat: STORE.earthWeather.location.lat,
        lon: STORE.earthWeather.location.lon,
        alt: 336,
        start: STATE.getDateStart("YYYY-MM-DD"),
        end: STATE.getDateEnd("YYYY-MM-DD"),
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
