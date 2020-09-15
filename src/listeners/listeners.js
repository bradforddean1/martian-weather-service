/**
 * Runs listeners after render function.
 */
(function () {
    /**
     * Watch compare button
     */
    // $("#js-content-wrapper").on("submit", "#js-comp-earth-to-mars", function (
    //     e
    // ) {
    //     e.preventDefault();
    //
    //     if (!STORE.earthWeather.location.isLocSet()) {
    //         renderGeoRes(true);
    //     } else {
    //         updateData().then(() => {
    //             STATE.activemeasure = "at";
    //             render();
    //         });
    //     }
    // });

    /**
     * Watch measure selctor buttons (mobile)
     */
    $("#js-content-wrapper").on("click", ".js-measure-selector", function (e) {
        // e.preventDefault();
        const measure = $(this).attr("data-measure");
        STATE.activemeasure = measure;
        render();
    });

    /**
     * Watch measure inputs
     */
    $("#js-content-wrapper").on("change", ".js-date-selector", function (e) {
        STATE.setDateStart($("#js-start-date").val());
        STATE.setDateEnd($("#js-end-date").val());

        updateData().then(() => {
            render();
        });
    });

    /**
     * watch legend call back items - this does nothing.
     */
    $("#js-content-wrapper").on("click", ".js-legend-item", function (e) {
        // e.preventDefault();
        legendClickCallback(e);
    });

    /**
     * watch unit selector buttons
     */
    $("#js-content-wrapper").on("click", ".unit button", function (e) {
        // e.preventDefault();
        const measure = $(this).attr("data-measure");
        if (measure == "at") {
            STORE.isFarenheight = !STORE.isFarenheight;
        } else if (measure == "wind") {
            STORE.isMph = !STORE.isMph;
        }
        render();
    });

    /**
     * watch location input on splash screen
     */
    $("#js-content-wrapper").on("keyup", "#js-location-selector", function () {
        const geoRes = geolocate($(this).val());
        renderGeoRes();
    });

    /**
     * watch ok button (proceed) on error api intermodal.
     */
    $("#js-content-wrapper").on("click", "#js-clear-error", function (e) {
        e.preventDefault();
        renderError();
    });

    /**
     * watch goback anchor (return to splash)
     */
    $("#js-content-wrapper").on("click", "#js-go-back", function (e) {
        e.preventDefault();
        renderSplash();
    });
})();

/**
 * A work in progress - effectively does nothing.
 */
function legendClickCallback(event) {
    event = event || window.event;

    var target = event.target || event.srcElement;
    while (target.nodeName !== "th") {
        target = target.parentElement;
    }
    var parent = target.parentElement;
    var chartId = parseInt(parent.classList[0].split("-")[0], 10);
    var chart = Chart.instances[chartId];
    var index = Array.prototype.slice.call(parent.children).indexOf(target);

    chart.legend.options.onClick.call(
        chart,
        event,
        chart.legend.legendItems[index]
    );
    if (chart.isDatasetVisible(index)) {
        target.classList.remove("hidden");
    } else {
        target.classList.add("hidden");
    }
}
