/**
 * Populates martian weather data store with a passed in dataset.
 * @param {object} data - Data to be populated in store
 */
function pushMartianData(data) {
    for (i = 0, keys = Object.keys(data); i < keys.length - 2; i++) {
        try {
            STORE.martianWeather.at.push({
                sol: keys[i],
                utc: data[keys[i]].Last_UTC,
                avg: data[keys[i]].AT.av,
                high: data[keys[i]].AT.mx,
                low: data[keys[i]].AT.mn,
            });
        } catch (error) {
            STORE.apiError.push(error);
        }

        try {
            STORE.martianWeather.pressure.push({
                sol: keys[i],
                utc: data[keys[i]].Last_UTC,
                avg: data[keys[i]].PRE.av,
                high: data[keys[i]].PRE.mx,
                low: data[keys[i]].PRE.mn,
            });
        } catch (error) {
            STORE.apiError.push(error);
        }
        try {
            STORE.martianWeather.wind.push({
                utc: data[keys[i]].Last_UTC,
                avg: data[keys[i]].HWS.av,
                high: data[keys[i]].HWS.mx,
                low: data[keys[i]].HWS.mn,
                windDir: data[keys[i]].WD.most_common.compass_point,
            });
        } catch (error) {
            STORE.apiError.push(error);
        }
    }
}
