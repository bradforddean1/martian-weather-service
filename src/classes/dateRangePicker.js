/**
 * Defines functionality of date-range picker component.  Handles change in date and returns both Martian and Terran dates in range.
 * @property {object} dateStart
 * @property {object} dateEnd
 */
class DateRangePicker {
    constructor() {
        /**
         * @private
         */
        let _dateStart = moment().subtract(6, "days");
        /**
         * @private
         */
        let _dateEnd = moment();

        /**
         * Set the start date (roman calendar) property, Insight Sol Date propery from string input
         * @param {string} date
         */
        this.setDateStart = function (date) {
            _dateStart = moment(date);
        };

        /**
         * Set the end date (roman calendar) property, Insight Sol Date propery from string input.
         * @param {string} date
         */
        this.setDateEnd = function (date) {
            _dateEnd = moment(date);
        };

        /**
         * Translates UTC to Sols as defined by gthe NASA Insight program.
         * Conversion is one to oneand returns a conversion for the same number of periods (planetray rotations) and does not convert to equivalent periods in time.
         * @private
         * @returns {integer} - Number of days defined in date range.
         */
        const _utcToMartianDate = function (utc) {
            const beginTimeKeep = moment("2018-11-26");
            const sol =
                Math.abs(beginTimeKeep.diff(utc, "days")) / 1.0274912517;
            return Math.floor(sol);
        };

        /**
         * Get the start date of range in Sols (as defined by NASA INsight program) calculated from the dateEnd property.
         * @returns {integer} - The sol corresponing with the currently set start date (based on same # of planetary rotations counted back from the set end date.).
         */
        this.getSolStart = function () {
            return (
                _utcToMartianDate(moment(this.getDateEnd("YYYY-MM-DD"))) -
                this.getNumDays()
            );
        };

        /**
         * Get the end date of range in Sols (as defined by NASA INsight program) calculated from the dateEnd.
         * @returns {integer} - The sol corresponing with the currently set end date.
         */
        this.getSolEnd = function () {
            return _utcToMartianDate(_dateEnd);
        };

        /**
         * Get the first day of date range in Roman calendar terms from date property, if not set will set a new date.
         * @param {string} [format] - if defined allows specification of return string format i.e. MM-DD, or MM-DD-YY.
         * @returns {object | string} - if format defined returns in string format otherwise returns moment() object.
         */
        this.getDateStart = function (format = null) {
            if (format) {
                return _dateStart.format(format);
            } else {
                return _dateStart;
            }
        };

        /**
         * Get the last day of date range in Roman calendar terms from date property, if not set will set a new date.
         * @param {string} format - Specifies return string format i.e. MM-DD, or MM-DD-YY.
         * @returns {string} - Returns last day of date range in specified format.
         */
        this.getDateEnd = function (format) {
            return _dateEnd.format(format);
        };

        /**
         * Get the number of days defined in date range
         * @returns {integer} - Number of days defined in date range.
         */
        this.getNumDays = function () {
            const diffDays = _dateEnd.diff(_dateStart, "days");
            return diffDays + 1;
        };
    }

    /**
     * Date Selector change handler
     */
    handleDateChange() {
        this.setDateStart($("#js-start-date").val());
        this.setDateEnd($("#js-end-date").val());

        updateData(this).then(() => {
            render();
        });
    }

    /**
     * Generate html for the datepicker object
     * @returns {string} - Datepicker html.
     */
    render() {
        `
        <div class="container date-selector ">
            <h3>Select Date Range:</h3>
            <form
                id="js-date-picker"
                class="container ctr-justified"
                action="submit"
            >
                <div class="container date-range-picker">
                    <div class="container date-picker">
                        <input
                            type="date"
                            name="start-date"
                            title="start date"
                            id="js-start-date"
                            class="js-date-selector"
                            value="${this.getDateStart("YYYY-MM-DD")}"
                                              max="${moment().format(
                                                  "YYYY-MM-DD"
                                              )}"
                                              min="${moment()
                                                  .subtract(6, "days")
                                                  .format("YYYY-MM-DD")}"
                                          />
                                          <span
                            class="sol"
                            id="js-sol-start"
                            onchange=${this.handleDateChange()}
                        >Sol ${this.getSolStart()}
                        </span>
                    </div>
                    <div class="container date-picker">
                        <input
                            type="date"
                            name="end-date"
                            title="end date"
                            id="js-end-date"
                            class="js-date-selector"
                            value="${this.getDateEnd("YYYY-MM-DD")}"
                                              max="${moment().format(
                                                  "YYYY-MM-DD"
                                              )}"
                                              min="${moment()
                                                  .subtract(6, "days")
                                                  .format("YYYY-MM-DD")}"
                                          />
                                          <span
                            class="sol"
                            id="js-sol-end"
                            onchange=${this.handleDateChange()}
                        >Sol ${this.getSolEnd()}
                        </span>
                    </div>
                </div>
            </form>
        </div>`;
    }
}

export default DateRangePicker;
