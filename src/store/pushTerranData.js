/**
 * Populates Terran weather data store with a passed in dataset.
 * @param {object} data - Data to be populated in store
 */
function pushTerranData(data) {
    for (i = 0; i < data.length; i++) {
        STORE.earthWeather.at.push({
            utc: new Date(data[i].date),
            avg: data[i].tavg,
            high: data[i].tmax,
            low: data[i].tmin,
        });
        STORE.earthWeather.pressure.push({
            utc: new Date(data[i].date),
            avg: data[i].pres,
        });
        STORE.earthWeather.wind.push({
            utc: new Date(data[i].date),
            avg: data[i].wspd,
            windDir: degreesToBearing(data[i].wdir),
        });
    }
}
