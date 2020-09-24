import $ from "jquery";
import renderSplash from "./src/render/renderSplash";
import geoLocate from "./src/api/geoLocate";
import isLocSet from "./src/utils/isLocSet";
import getPlanetaryData from "./src/refresh/getPlanetaryData";
import renderResults from "./src/render/renderResults";

const STORE = {
    apiError: [],
    activemeasure: "at",
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
        },
        at: [],
        pressure: [],
        wind: [],
    },
};

$(window).on("load", () => {
    async function handleSubmitLocation() {
        const geoData = geoLocate($("#js-location-selector").val());

        if (await geoData.error) {
            renderLocError();
        } else {
            console.log(await geoData);
            const planetaryData = getPlanetaryData(geoData, null);
            $("#js-content-wrapper").html(`
              ${renderResults()}
            `);
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
