import header from "./renderHeader";

const renderResult = (address) => {
    return `
        ${header(address)}  
        <p>I am the result page.</p>
        `;
};

export default renderResult;
