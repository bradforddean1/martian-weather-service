const defaultPlanetaryData = {
    martianWeather: {
        at: [
            // { avg: 80,
            //   high: 100,
            //   low: 60,
            //   sol: 277,
            //   utc: 77123123234234 }
        ],
        pressure: [],
        wind: [],
    },
    earthWeather: {
        at: [],
        pressure: [],
        wind: [],
    },
};

// Matt, Above is an exampel of how this works with the current array content.
// As I am working on getting the data from the server it is becoming clear
// the follwoing woudl make more sense:

/* 

at: [
            { 
                mars: {
                    avg: 80,
                    high: 100,
                    low: 60,
                },
                earth: {
                    avg: 80,
                    high: 100,
                    low: 60,
                },
                sol: 277,
                utc: 77123123234234 }
        ],
pressure: [],
    wind: [],

*/
export default defaultPlanetaryData;
