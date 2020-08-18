const STATE = {
    isFarenheight: false,
    isMph: false,
    apiError: [],
    activemeasure: null, //"temp", "pres", "wind"
    // isSplashActive: false,
    dateStart: null,
    dateEnd: null,
    solStart: null,
    solEnd: null,
    setDateStart: function (date) {
        this.dateStart = moment(date);
        this.solStart =
            this.utcToMartianDate(moment(this.getDateEnd("YYYY-MM-DD"))) -
            this.getNumDays();
    },
    setDateEnd: function (date) {
        this.dateEnd = moment(date);
        this.solEnd = this.utcToMartianDate(this.dateEnd);
    },
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
    getSolEnd: function () {
        if (!this.solEnd) {
            this.solEnd = this.utcToMartianDate(this.dateEnd);
        }
        return this.solEnd;
    },
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
    getDateEnd: function (format) {
        if (!this.dateEnd) {
            const date = moment();
            this.dateEnd = date;
        }

        return this.dateEnd.format(format);
    },
    getNumDays: function () {
        diffDays = this.dateEnd.diff(this.dateStart, "days");
        return diffDays + 1;
    },
    utcToMartianDate: function (utc) {
        const beginTimeKeep = moment("2018-11-26");
        const sol = Math.abs(beginTimeKeep.diff(utc, "days")) / 1.0274912517;
        return Math.floor(sol);
    },
    chartCtx: null,
    chartLegend: null,
};
