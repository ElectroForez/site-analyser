interface GetCounts {
    [index: string | number | symbol]: number;
}

export function getCounts(array: Array<string | number>) {
    /* returns obj with values and how many of them are in the array */
    return array.reduce((stat, value) => {
        if (!stat[value]) stat[value] = 0;
        stat[value]++;
        return stat;
    }, <GetCounts>{});
}
