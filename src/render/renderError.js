function renderError() {
    const error = STATE.apiError;
    const errorInDom = $("#js-content-wrapper").find(".api-error");

    if (errorInDom) {
        $(errorInDom).remove();
    }

    if (STATE.apiError.length > 0) {
        STATE.apiError = [];
        let errorText = [];
        for (const e of error) {
            errorText.push(`<span>${e}</span>`);
        }

        errorTextHtml = errorText.join("");
        $("#js-content-wrapper").append(`
        <div class="bg-error api-error">
            <div class="bg-dark api-error-container">
                <img src="assets/attenae.svg" alt="antenna">
                ${errorTextHtml}
                <button id="js-clear-error">Ok</button>
            </div>
        </div>`);
    } else {
    }
}
