/**
 * Renders (or clears) the #api-error element html, when errors are presnt in then apiErrors array.  If renderError is run and no erros are present empty the #api-erro element.
 */
function renderError() {
    const error = STORE.apiError;
    const errorInDom = $("#js-content-wrapper").find(".api-error");

    if (errorInDom) {
        $(errorInDom).remove();
    }

    if (STORE.apiError.length > 0) {
        STORE.apiError = [];
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
