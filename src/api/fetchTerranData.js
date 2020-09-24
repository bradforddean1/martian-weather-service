import formatQueryParams from "../utils/formatQueryParams";
/**
 * Fetches local (earth) weather data from the meteostat api: https://dev.meteostat.net/#:~:text=Meteostat%20is%20an%20open%20platform,request%20your%20personal%20API%20key
 * @author Bradford Dean Wilson <bradford.dean.wilson@gmail.com>
 * @return {Promise} Promise object with response data from the server
 *
 */
function fetchTerranData(geoData, dateRange = null) {
    const headers = new Headers();
    headers.append("x-api-key", "BXfdILEuBoXF0cB2NIrZVc5ileNAC4lW");
    // headers.append("Access-Control-Allow-Origin", "*");

    // const requestOptions = {
    //     method: "GET",
    //     headers: headers,
    //     redirect: "follow",
    // };

    let params = {
        lat: "33.749",
        lon: "-84.388",
        alt: "336",
        start: "2020-08-01",
        end: "2020-9-18",
    };

    params = formatQueryParams(params);

    // return fetch(
    //     //`https://cors-anywhere.herokuapp.com/https://api.meteostat.net/v2/point/daily?${params}`,
    //     `https://api.meteostat.net/v2/point/daily?lat=33.749&lon=-84.388&alt=336&start=2020-08-01&end=2020-9-18`,
    //     requestOptions
    // )
    //     .then((response) => {
    //         if (response.ok) {
    //             return response.json().data;
    //         }
    //         throw new Error(
    //             "Failed to retrieve terran data from weather service."
    //         );
    //     })
    //     .catch((err) => {
    //         console.log("here");
    //         STATE.apiError.push(err);
    //         return false;
    //     });

    return new Promise(function (resolve, reject) {
        resolve({
            data: {
                meta: {
                    source:
                        "National Oceanic and Atmospheric Administration, Deutscher Wetterdienst",
                    exec_time: 0.19,
                    generated: "2020-09-21 01:28:01",
                },
                data: [
                    {
                        date: "2020-09-12",
                        tavg: 25.4,
                        tmin: 23,
                        tmax: 30.6,
                        prcp: 0.5,
                        snow: 0,
                        wdir: 107,
                        wspd: 11,
                        wpgt: null,
                        pres: null,
                        tsun: null,
                    },
                    {
                        date: "2020-09-13",
                        tavg: 24.9,
                        tmin: 22.9,
                        tmax: 30.2,
                        prcp: 0,
                        snow: 0,
                        wdir: 101,
                        wspd: 9,
                        wpgt: null,
                        pres: null,
                        tsun: null,
                    },
                    {
                        date: "2020-09-14",
                        tavg: 25,
                        tmin: 22.1,
                        tmax: 28.9,
                        prcp: null,
                        snow: null,
                        wdir: 74,
                        wspd: 11,
                        wpgt: null,
                        pres: null,
                        tsun: null,
                    },
                    {
                        date: "2020-09-15",
                        tavg: 21.8,
                        tmin: 20.1,
                        tmax: 23.9,
                        prcp: null,
                        snow: null,
                        wdir: 81,
                        wspd: 19,
                        wpgt: null,
                        pres: null,
                        tsun: null,
                    },
                    {
                        date: "2020-09-16",
                        tavg: 18.4,
                        tmin: 17.4,
                        tmax: 20.6,
                        prcp: null,
                        snow: null,
                        wdir: 76,
                        wspd: 17,
                        wpgt: null,
                        pres: null,
                        tsun: null,
                    },
                    {
                        date: "2020-09-17",
                        tavg: 20.5,
                        tmin: 18.6,
                        tmax: 23.6,
                        prcp: null,
                        snow: null,
                        wdir: 97,
                        wspd: 14,
                        wpgt: null,
                        pres: null,
                        tsun: null,
                    },
                    {
                        date: "2020-09-18",
                        tavg: 22.1,
                        tmin: 18.4,
                        tmax: 27.2,
                        prcp: null,
                        snow: null,
                        wdir: 333,
                        wspd: 9,
                        wpgt: null,
                        pres: null,
                        tsun: null,
                    },
                ],
            },
        });
    });
}

export default fetchTerranData;
