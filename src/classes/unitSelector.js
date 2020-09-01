import $ from "jquery";

/**
 * Defines functionality for toggleing metric or US Standard Units.
 * @property {boolean} isFarenheight
 * @property {boolean} isMph
 */
class unitSelector {
    constructor() {
        this.isFarenheight = false;
        this.isMph = false;
    }

    /**
     * Handler for unit selector click event
     */
    handleUnitChange() {
        e.preventDefault();
        const measure = $(this).attr("data-measure");
        if (measure == "at") {
            this.isFarenheight = !this.isFarenheight;
        } else if (measure == "wind") {
            this.isMph = !this.isMph;
        }
        render();
    }

    /**
     * Get html for the unit selctor
     * @param {string} measure
     * @returns {string} - html for the unit slector
     */
    getUnitContainer(measure) {
        if (measure == "at") {
            return `
            <div class="container unit">
                <button class="left onclick=${this.handleUnitChange}
                    ${
                        this.isFarenheight ? "" : "toggle-on"
                    }" data-measure="at">°C</button>
                <button class="right ${
                    this.isFarenheight ? "toggle-on" : ""
                }" data-measure="at">°F</button>
            </div>`;
        }

        if (measure == "pressure") {
            return `
            <div class="container unit">
                <button class="toggle-on" data-measure="at">hPh</button>
            </div>`;
        }

        if (measure == "wind") {
            return `
            <div class="container unit">
                <button class="left ${
                    this.isMph ? "" : "toggle-on"
                }" data-measure="wind">kPh</button>
                <button class="right ${
                    this.isMph ? "toggle-on" : ""
                }" data-measure="wind">mPh</button>
            </div>`;
        }
    }
}

export default unitSelector;
