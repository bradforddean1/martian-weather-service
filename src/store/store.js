const  STORE = {
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
          isLocSet: function () {
              if (this.address && this.lat && this.lon) {
                  return true;
              }
              return false;
          },
      },
      at: [],
      pressure: [],
      wind: [],
  },
  getConversionFunction: function () {
      // standard conversion function is return data as is, if a non-metric conversion is selected,
      // a conversion function is defined. Always returns a rounded value.
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
  getDataByMeasure: function (measure, planet) {
      // temp and wind data may need to be converted
      if (measure == "at" || measure == "wind") {
          const response = [];

          const convert = this.getConversionFunction();

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

      const convert = this.getConversionFunction();
      const avg = total / count;
      return convert(avg);
  },

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

      const convert = this.getConversionFunction();
      const avg = Math.max(...all);
      return convert(avg);
  },
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

      const convert = this.getConversionFunction();
      const avg = Math.min(...all);
      return convert(avg);
  }
}
