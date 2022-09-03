const COLUMNS = {
    url: {
        name: "url",
        title: "URL"
    },
    values: {
        name: "values",
        title: null
    },
    redirect: {
        name: "redirect",
        title: "Redirected"
    },
    error: {
        name: "error",
        title: "Error"
    }
};

function addColumn(matrix, col) {
    //init column if matrix empty
    if (!matrix.length) {
        matrix.push(...Array.from({length: col.length}, () => []));
    }
    matrix.forEach((row, i) => row.push(col[i]));
}

function resultsToMatrix(results, {includedColumns = [], addAction = (header, body, colName) => null}) {
    const header = [];
    const body = [];

    includedColumns.forEach((columnName) => {
        if (!(columnName in COLUMNS)) throw new Error('Invalid column for include');

        const columnTitle = COLUMNS[columnName].title;
        if (columnTitle !== null) header.push(columnTitle);

        switch (columnName) {
            case COLUMNS.url.name:
                addColumn(body, Object.keys(results));
                break;
            case COLUMNS.redirect.name:
                const redirects = Object.values(results).map(result => result.redirect);
                addColumn(body, redirects);
                break;
            default:
                addAction(header, body, columnName);
        }
    });

    const matrix = [
        header,
        ...body
    ];
    return matrix;
}

function successToMatrix(sucResults, options = {}) {
    options = {
        includedColumns: [
            COLUMNS.url.name,
            COLUMNS.values.name,
            COLUMNS.redirect.name
        ],
        ...options
    }
    const sucAction = (header, body, columnName) => {
        switch (columnName) {
            case COLUMNS.values.name:
                const values = Object.values(sucResults).map(result => result.value);
                header.push(
                    ...Array.from(
                        {length: values[0].length},
                        (v, k) => k + 1 + " место"
                    )
                );

                values.forEach((value, index) => body[index].push(...value));
                break;
            default:
                throw new Error(`No handler for column ${columnName}`);
        }
    };

    return resultsToMatrix(sucResults, {
        includedColumns: options.includedColumns,
        addAction: sucAction
    });
}

function errsToMatrix(errResults, options = {}) {
    options = {
        includedColumns: [
            COLUMNS.url.name,
            COLUMNS.error.name,
            COLUMNS.redirect.name
        ],
        ...options
    }
    const errAction = (header, body, columnName) => {
        switch (columnName) {
            case COLUMNS.error.name:
                const errors = Object.values(errResults).map(result => result.reason);
                addColumn(body, errors);
                break;
            default:
                throw new Error(`No handler for column ${columnName}`);
        }
    };

    return resultsToMatrix(errResults, {
        includedColumns: options.includedColumns,
        addAction: errAction
    });
}

module.exports = {
    successToMatrix,
    errsToMatrix,
    COLUMNS
};
