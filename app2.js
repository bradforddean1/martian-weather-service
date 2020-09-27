import $ from "jquery";
import renderSplash from "./src/render/renderSplash";
import geoLocate from "./src/api/geoLocate";
import isLocSet from "./src/utils/isLocSet";
import getPlanetaryData from "./src/api/getPlanetaryData";
import renderResults from "./src/render/renderResults";

const STORE = {
    apiError: [],
    activemeasure: "at",
    planetaryData: {},
    // martianWeather: {
    //     at: [],
    //     pressure: [],
    //     wind: [],
    // },
    // earthWeather: {
    //     at: [],
    //     pressure: [],
    //     wind: [],
    // },
};

$(window).on("load", () => {
    async function handleSubmitLocation() {
        const geoQuery = geoLocate($("#js-location-selector").val());
        const geoData = await geoQuery;
        if (geoData.error) {
            renderLocError();
        } else {
            const weatherQuery = getPlanetaryData(geoData, null);
            STORE.planetaryData = await weatherQuery;
            //  Seems a bit sloppy just pushing api reuslts into the STORE... though is it necessary here to
            //  to follow loop through the planetary Data Object and manually set each data point for the sake
            //  of client side validation of the data retrieved?  I know the server side rule: never trust the cleint,
            //  but does that go both ways, i.e. never trust the server?
            $("#js-content-wrapper").html(`
              ${renderResults(geoData.address)}
            `);
            console.log(geoData.address);

            // updateData(dateRange).then(() => {
            //     STORE.activemeasure = "at";
            //     render();
            // });
        }
    }

    $("#js-content-wrapper").on("submit", "#js-comp-earth-to-mars", function (
        e
    ) {
        e.preventDefault();
        handleSubmitLocation();
    });

    $("#js-content-wrapper").html(`
    ${renderSplash()}
  `);
});

// import renderData from "./src/render/renderData";
// import DateRangePicker from "./src/classes/dateRangePicker";
//
// const dateRange = new DateRangePicker();

// const renderApp = () => {
//     const measure = STATE.activemeasure;
//
//     if (STORE.earthWeather.location.isLocSet()) {
//         const html = $("#js-content-wrapper").html(
//           renderHeader();
//           renderMain();
//           renderFooter();
//       );
//
//         renderChart(
//             measure,
//             dateRange,
//             $(html).find("#myChart")[0].getContext("2d"),
//             $(html).find("#legend")
//         );
//
//         if (STATE.apiError.length > 0) {
//             renderError();
//         }
//     } else {
//         renderSplash();
//     }
// };

//watch compare
// $("#js-content-wrapper").on("submit", "#js-comp-earth-to-mars", function (e) {
//     e.preventDefault();
//
//     if (!STORE.earthWeather.location.isLocSet()) {
//         renderGeoRes(true);
//     } else {
//         geolocate($("#js-location-selector").val()).then(() => {
//             updateData(dateRange).then(() => {
//                 STATE.activemeasure = "at";
//                 render();
//             });
//         });
//     }
// });

// return;

// Listeners
//watch measure
// $("#js-content-wrapper").on("click", ".js-measure-selector", function (e) {
//     e.preventDefault();
//     STATE.activemeasure = $(this).attr("data-measure");
//     render();
// });
//
// //watch legend call back items
// $("#js-content-wrapper").on("click", ".js-legend-item", function (e) {
//     legendClickCallback(e);
// });
//
// // watch location
// $("#js-content-wrapper").on("input", "#js-location-selector", function (e) {
//     geolocate($(this).val()).then(() => {
//         renderGeoRes();
//     });
// });
//
// // watch ok error
// $("#js-content-wrapper").on("click", "#js-clear-error", function (e) {
//     e.preventDefault();
//     renderError();
// });
//
// //watch go back
// $("#js-content-wrapper").on("click", "#js-go-back", function (e) {
//     e.preventDefault();
//     STORE.earthWeather.location.reset();
//     render();
// });
