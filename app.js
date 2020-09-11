import $ from "jquery";
import renderData from "./src/render/renderData";
import DateRangePicker from "./src/classes/dateRangePicker";

const dateRange = new DateRangePicker();

const render = () => {
    const measure = STATE.activemeasure;

    if (STORE.earthWeather.location.isLocSet()) {
        //prettier-ignore
        const html = $("#js-content-wrapper").html(
          `
          <header class="bg-dark">
                  <div class="container" style="">
                      <h2>
                          <span class="caption">comparing to:</span>
                          ${STORE.earthWeather.location.address}
                      </h2>
                      <a id="js-go-back" class="goBack" href="#">
                          <img src="assets/arrow_back.svg" alt="Go Back">
                      </a>
                  </div>
          </header>
          <main class = "bg-secondary fill">
              <div class="vbox full-height">
                  <div class="horz-borders">
                      <div class ="centered-content fill">
                          ${dateRange.render()}
                      </div>
                  </div>
                  <div class="main-content">
                    ${renderData(measure)}
                  </div>
              </div>
          </main>
          <footer>
              <div class="wrapper centered-content">
                  <div class="mobile-nav">
                      <div class="container-back"></div>
                      <div class="container">
                          <a class="bbox js-measure-selector" data-measure="at">
                              <div class="circle ${STATE.activemeasure == "at" && "mobnav-button-selected"}"></div>
                              <span class="${STATE.activemeasure == "at" && "mobnav-button-selected"}">°C/°F</span>
                          </a>
                          <a class="bbox js-measure-selector" data-measure="pressure">
                              <div class="circle ${STATE.activemeasure == "pressure" && "mobnav-button-selected"}"></div>
                              <span class="${STATE.activemeasure == "pressure" && "mobnav-button-selected"}">hPa</span>
                          </a>
                          <a class="bbox js-measure-selector" data-measure="wind">
                              <div class="circle ${STATE.activemeasure == "wind" && "mobnav-button-selected"}"></div>
                              <span class="${STATE.activemeasure == "wind" && "mobnav-button-selected"}">Wind</span>
                          </a>
                      </div>
                  </div>
              </div>
          </footer>`
      );

        renderChart(
            measure,
            dateRange,
            $(html).find("#myChart")[0].getContext("2d"),
            $(html).find("#legend")
        );

        if (STATE.apiError.length > 0) {
            renderError();
        }
    } else {
        renderSplash();
    }
};

//watch compare
$("#js-content-wrapper").on("submit", "#js-comp-earth-to-mars", function (e) {
    e.preventDefault();

    if (!STORE.earthWeather.location.isLocSet()) {
        renderGeoRes(true);
    } else {
        geolocate($("#js-location-selector").val()).then(() => {
            updateData(dateRange).then(() => {
                STATE.activemeasure = "at";
                render();
            });
        });
    }
});

// return;

// Listeners
//watch measure
$("#js-content-wrapper").on("click", ".js-measure-selector", function (e) {
    e.preventDefault();
    STATE.activemeasure = $(this).attr("data-measure");
    render();
});

//watch legend call back items
$("#js-content-wrapper").on("click", ".js-legend-item", function (e) {
    legendClickCallback(e);
});

// watch location
$("#js-content-wrapper").on("input", "#js-location-selector", function (e) {
    geolocate($(this).val()).then(() => {
        renderGeoRes();
    });
});

// watch ok error
$("#js-content-wrapper").on("click", "#js-clear-error", function (e) {
    e.preventDefault();
    renderError();
});

//watch go back
$("#js-content-wrapper").on("click", "#js-go-back", function (e) {
    e.preventDefault();
    STORE.earthWeather.location.reset();
    render();
});

$(window).on("load", () => {
    render();
});

export { render };
