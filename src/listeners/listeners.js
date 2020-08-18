(function () {
    //watch compare
    $("#js-content-wrapper").on("submit", "#js-comp-earth-to-mars", function (
        e
    ) {
        e.preventDefault();

        if (!STORE.earthWeather.location.isLocSet()) {
            renderGeoRes(true);
        } else {
            updateData().then(() => {
                STATE.activemeasure = "at";
                render();
            });
        }
    });

    // return;

    //watch measure
    $("#js-content-wrapper").on("click", ".js-measure-selector", function (e) {
        // e.preventDefault();
        const measure = $(this).attr("data-measure");
        STATE.activemeasure = measure;
        render();
    });

    // watch daterange
    $("#js-content-wrapper").on("change", ".js-date-selector", function (e) {
        STATE.setDateStart($("#js-start-date").val());
        STATE.setDateEnd($("#js-end-date").val());

        updateData().then(() => {
            render();
        });
    });

    //watch legend call back items
    $("#js-content-wrapper").on("click", ".js-legend-item", function (e) {
        // e.preventDefault();
        legendClickCallback(e);
        alert("hello");
    });

    // watch unit-selector
    $("#js-content-wrapper").on("click", ".unit button", function (e) {
        // e.preventDefault();
        const measure = $(this).attr("data-measure");
        if (measure == "at") {
            STATE.isFarenheight = !STATE.isFarenheight;
        } else if (measure == "wind") {
            STATE.isMph = !STATE.isMph;
        }
        render();
    });

    // watch location
    $("#js-content-wrapper").on("keyup", "#js-location-selector", function () {
        const geoRes = geolocate($(this).val());
        renderGeoRes();
    });

    // watch ok error
    $("#js-content-wrapper").on("click", "#js-clear-error", function (e) {
        e.preventDefault();
        renderError();
    });

    //watch go back
    $("#js-content-wrapper").on("click", "#js-go-back", function (e) {
        e.preventDefault();
        renderSplash();
    });
})();

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
