/**
 * Global state parameters.
 */
const STATE = {
    isFarenheight: false,
    isMph: false,
    apiError: [],
    activemeasure: null, //"temp", "pres", "wind"
    dateStart: null,
    dateEnd: null,
    solStart: null,
    solEnd: null,
    /**
     * Set the start date (roman) property, Insight Sol Date propery from string input
     * @param {string} date
     */
    setDateStart: function (date) {
        this.dateStart = moment(date);
        this.solStart =
            this.utcToMartianDate(moment(this.getDateEnd("YYYY-MM-DD"))) -
            this.getNumDays();
    },
    /**
     * Set the end date (roman) property, Insight Sol Date propery from string input
     * @param {string} date
     */
    setDateEnd: function (date) {
        this.dateEnd = moment(date);
        this.solEnd = this.utcToMartianDate(this.dateEnd);
    },
    /**
     * Get the date in Sols (as defined by NASA INsight program) from sol date property, if not set will set a new date.
     * @returns {integer} - The defined sol start date.
     */
    getSolStart: function () {
        if (!this.solStart) {
            this.solStart =
                this.utcToMartianDate(moment(this.getDateEnd("YYYY-MM-DD"))) -
                this.getNumDays();
            return this.solStart;
        } else {
            return this.solStart;
        }
    },
    /**
     * Get the last dat of date date range in Sols (as defined by NASA INsight program) from sol date property, if not set will set a new date from default.
     * @returns {integer} - The sol corresponing with the currently set end date.
     */
    getSolEnd: function () {
        if (!this.solEnd) {
            this.solEnd = this.utcToMartianDate(this.dateEnd);
        }
        return this.solEnd;
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

    /**
     * Holds html5 canvas reference for Chart.js output
     * These may be able to be removed...
     */
    chartCtx: null,
    chartLegend: null,
};
