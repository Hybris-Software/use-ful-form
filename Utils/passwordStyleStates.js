function passwordStyleStates(securityLevel, lowClass, mediumClass, highClass, strongClass) {

    if (securityLevel === "low") {
        return lowClass;
    } else if (securityLevel === "medium") {
        return mediumClass;
    } else if (securityLevel === "high") {
        return highClass;
    } else if (securityLevel === "strong") {
        return strongClass;
    }
    else {
        return "";
    }
}

export default passwordStyleStates;