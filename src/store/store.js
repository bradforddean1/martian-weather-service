/**
 * Terran and Martian weather data!
 * @namespace
 * @property {object} martianWeather - martian weather data store
 * @property {array} martianWeather.at - array of air temperature data
 * @property {array} martianWeather.pressure - array of air pressure data
 * @property {array} martianWeather.wind - array of wind behavioral data
 * @property {object} earthWeather - earth weather data store
 * @property {object} earthWeather.location - location data for the earth weather data set.
 * @property {string} earthWeather.address - standardized address of data location marker.
 * @property {string} earthWeather.location - latitude of data location marker.
 * @property {string} earthWeather.location - longitude data location marker.
 * @property {array} earthWeather.at - array of air temperature data
 * @property {array} earthWeather.pressure - array of air pressure data
 * @property {array} earthWeather.wind - array of wind behavioral data
 */
const STORE = {
    martianWeather: {
        at: [],
        pressure: [],
        wind: [],
    },
    earthWeather: {
        location: {
            address: "",
            lat: null,
            lon: null,
            /**
             * Checks all of location properties to determine if all 3 are set.
             * @returns {boolean} - Returns true if all 3 locaton properties are set.
             */
            isLocSet: function () {
                if (this.address && this.lat && this.lon) {
                    return true;
                }
                return false;
            },

            /**
             * reset all location parameters to null
             */
            reset: function () {
                this.address = "";
                this.lat = null;
                this.lon = null;
            },
        },
        at: [],
        pressure: [],
        wind: [],
    },

    /**
     * Defines how get getDataByMeasure will return data.  Standard conversion function is return data as is, if a non-metric conversion is selected, a conversion function is defined. Always returns a rounded value.
     * @param {string} measure - weather measure of data to be returned by getDataByMeasure.
     * @returns {function} - A conversion function.
     */
    getConversionFunction: function (measure) {
        let convert = function (value) {
            return Math.round(value).toString();
        };

        if (measure == "at" && STATE.isFarenheight) {
            convert = function (value) {
                if (typeof (value != "undefined")) {
                    return Math.round(celsiusToFahrenheit(value)).toString();
                }
            };
        } else if (measure == "wind" && STATE.isMph) {
            convert = function (value) {
                if (typeof (value != "undefined")) {
                    return Math.round(kphToMph(value)).toString();
                }
            };
        }
        return convert;
    },

    /**
     * Get weather data of a particalr type weather measure from data store.
     * @param {string} measure - measure of data to be returned i.e. aur temp, air pressure, etc.
     * @param {string} planet - the name of the datastore constant from which to get data.
     * @returns {array} - Data for the requested measure.
     */
    getDataByMeasure: function (measure, planet) {
        // temp and wind data may need to be converted
        if (measure == "at" || measure == "wind") {
            const response = [];

            const convert = this.getConversionFunction(measure);

            // if conversion needed new array returned with convertable values converted.
            if (measure == "at") {
                if (planet == "martianWeather") {
                    for (let val of this.martianWeather.at) {
                        response.push({
                            sol: val.sol,
                            utc: val.utc,
                            avg: convert(val.avg),
                            high: convert(val.high),
                            low: convert(val.low),
                        });
                    }
                } else {
                    for (let val of this.earthWeather.at) {
                        response.push({
                            utc: val.utc,
                            avg: convert(val.avg),
                            high: convert(val.high),
                            low: convert(val.low),
                        });
                    }
                }
            } else if (measure == "wind") {
                if (planet == "martianWeather") {
                    for (let val of this.martianWeather.wind) {
                        response.push({
                            utc: val.utc,
                            avg: convert(val.avg),
                            high: convert(val.high),
                            low: convert(val.low),
                            windDir: val.windDir,
                        });
                    }
                } else {
                    for (let val of this.earthWeather.wind) {
                        response.push({
                            utc: val.utc,
                            avg: convert(val.avg),
                            windDir: val.windDir,
                        });
                    }
                }
            }
            return response;
        }

        // Otherwise return the data as is.
        return this[planet][measure];
    },

    /**
     * Get the aritmetic average of data of a particalr type of weather measure from data store.
     * @param {string} measure - measure of data to be returned i.e. aur temp, air pressure, etc.
     * @param {string} planet - the name of the datastore constant from which to get data.
     * @returns {number} - The average of dataset.
     */
    getAverage: function (planet, measure) {
        if (measure != "at" && measure != "pressure" && measure != "wind") {
            return "no data";
        }

        if (planet != "martianWeather" && planet != "earthWeather") {
            return "no data";
        }

        let total = 0;
        let count = 0;
        for (const rot of this[planet][measure]) {
            if (rot.avg) {
                total += rot.avg;
                count += 1;
            }
        }

        if (count < 1) {
            return "no data";
        }

        const convert = this.getConversionFunction(measure);
        const avg = total / count;
        return convert(avg);
    },

    /**
     * Get the largest number a particalr type of weather measure from data store.
     * @param {string} measure - measure of data to be returned i.e. aur temp, air pressure, etc.
     * @param {string} planet - the name of the datastore constant from which to get data.
     * @returns {number} - The largest number in dataset.
     */
    getMax: function (planet, measure) {
        if (measure != "at" && measure != "pressure" && measure != "wind") {
            return "no data";
        }

        if (planet != "martianWeather" && planet != "earthWeather") {
            return "no data";
        }

        const all = [];
        for (const rot of this[planet][measure]) {
            if (rot.high) {
                all.push(rot.high);
            }
        }

        if (all.length < 1) {
            return "no data";
        }

        const convert = this.getConversionFunction(measure);
        const avg = Math.max(...all);
        return convert(avg);
    },

    /**
     * Get the smallest number a particalr type of weather measure from data store.
     * @param {string} measure - measure of data to be returned i.e. aur temp, air pressure, etc.
     * @param {string} planet - the name of the datastore constant from which to get data.
     * @returns {number} - The smallest number in dataset.
     */
    getMin: function (planet, measure) {
        if (measure != "at" && measure != "pressure" && measure != "wind") {
            return "no data";
        }

        if (planet != "martianWeather" && planet != "earthWeather") {
            return "no data";
        }

        const all = [];
        for (const rot of this[planet][measure]) {
            if (rot.low) {
                all.push(rot.low);
            }
        }

        if (all.length < 1) {
            return "no data";
        }

        const convert = this.getConversionFunction(measure);
        const avg = Math.min(...all);
        return convert(avg);
    },
};
