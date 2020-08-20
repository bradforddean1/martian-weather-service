/**
 * tbd
 * @namespace
 * @property {boolean}isFarenheight - idenitifies unit of measure for air temprature.
 * @property {boolean} isMph -identifies unit of measure for wind speed.
 * @property {array} apiError - store of errors encountered during api call(s).
 * @property {string} activemeasure - active measure (for mobile rndering) i.e. "at", "pressure", "wind"
 */
const STATE = {
    isFarenheight: false,
    isMph: false,
    apiError: [],
    activemeasure: "at",
    dateStart: null,
    dateEnd: null,
    /**
     * Set the start date (roman calendar) property, Insight Sol Date propery from string input
     * @param {string} date
     */
    setDateStart: function (date) {
        this.dateStart = moment(date);
    },

    /**
     * Set the end date (roman calendar) property, Insight Sol Date propery from string input
     * @param {string} date
     */
    setDateEnd: function (date) {
        this.dateEnd = moment(date);
    },

    /**
     * Get the start date of range in Sols (as defined by NASA INsight program) calculated from the dateEnd property, if not set will set a new date.
     * @returns {integer} - The sol corresponing with the currently set start date.
     */
    getSolStart: function () {
        return (
            this.utcToMartianDate(moment(this.getDateEnd("YYYY-MM-DD"))) -
            this.getNumDays()
        );
    },

    /**
     * Get the end date of range in Sols (as defined by NASA INsight program) calculated from the dateEnd, if not set will set a new date from default.
     * @returns {integer} - The sol corresponing with the currently set end date.
     */
    getSolEnd: function () {
        return this.utcToMartianDate(this.dateEnd);
    },

    /**
     * Get the first day of date range in Roman calendar terms from date property, if not set will set a new date.
     * @param {string} [format] - if defined allows specification of return string format i.e. MM-DD, or MM-DD-YY.
     * @returns {object | string} - if format defined returns in string format otherwise returns moment() object.
     */
    getDateStart: function (format = null) {
        if (!this.dateStart) {
            const date = moment().subtract(6, "days");
            this.dateStart = date;
        }

        if (format) {
            return this.dateStart.format(format);
        } else {
            return this.dateStart;
        }
    },

    /**
     * Get the last day of date range in Roman calendar terms from date property, if not set will set a new date.
     * @param {string} format - Specifies return string format i.e. MM-DD, or MM-DD-YY.
     * @returns {string} - Returns last day of date range in specified format.
     */
    getDateEnd: function (format) {
        if (!this.dateEnd) {
            const date = moment();
            this.dateEnd = date;
        }

        return this.dateEnd.format(format);
    },

    /**
     * Get the number of days defined in date range
     * @returns {integer} - Number of days defined in date range.
     */
    getNumDays: function () {
        diffDays = this.dateEnd.diff(this.dateStart, "days");
        return diffDays + 1;
    },

    /**
     * Translates UTC to Sols as dfined by gthe NASA Insight program.
     * @returns {integer} - Number of days defined in date range.
     */
    utcToMartianDate: function (utc) {
        const beginTimeKeep = moment("2018-11-26");
        const sol = Math.abs(beginTimeKeep.diff(utc, "days")) / 1.0274912517;
        return Math.floor(sol);
    },
};
