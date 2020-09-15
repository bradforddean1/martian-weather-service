const renderFooter = () => {
    return `
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
        </footer>
      `;
};

export default renderFooter;
