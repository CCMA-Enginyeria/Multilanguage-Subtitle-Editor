define([], function() {
    const parseFromString = function(xmlText, type) {
        if(!xmlText) {
            return null;
        }

        let mustBeWrapped = (xmlText.indexOf('<tt:tt') === -1);
        if(mustBeWrapped) {
            xmlText = '<tt:tt xmlns:tt="http://www.w3.org/ns/ttml">' + xmlText + '</tt:tt>';
        }
        let xmlParsed = (new window.DOMParser()).parseFromString(xmlText, type);
        if (!xmlParsed || xmlParsed && xmlParsed.getElementsByTagName('parsererror').length > 0) {
            return null;
        }
        if(mustBeWrapped) {
            let childNode = xmlParsed.children[0].children[0];
            xmlParsed = document.implementation.createDocument('', '', null)
            xmlParsed.appendChild(childNode);
        }
        return xmlParsed;
    }
    return {
        parseFromString: parseFromString
    };
})