function getCounts(array) {
    /* returns obj with values and how many of them are in the array */
    return array.reduce((stat, value) => {
        if (!stat[value]) stat[value] = 0;
        stat[value]++;
        return stat;
    }, {});
}

module.exports = {
    getCounts
}