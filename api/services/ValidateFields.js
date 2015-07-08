exports.isNull = function(attribute) {

    var result;
    if (!attribute || attribute == "") {
        result = "N/A";
    } else {
        result = attribute;
    }
    return result;
};