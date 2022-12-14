import {ErrorResults, SuccessResults} from "./interfaces";
import {TransformData} from './interfaces'
import COLUMNS = TransformData.COLUMNS;

function addColumn(matrix: Array<Array<any>>, col: Array<any>) {
    //init column if matrix empty
    if (!matrix.length) {
        matrix.push(...Array.from({length: col.length}, () => []));
    }
    matrix.forEach((row, i) => row.push(col[i]));
}

function resultsToMatrix(results: SuccessResults | ErrorResults, options: TransformData.resultsToMatrixOptions) {
    const header: TransformData.header = [];
    const body: TransformData.body = [];

    options.includeColumns.forEach((columnName) => {
        if (!(columnName in COLUMNS)) throw new Error(`Invalid column '${columnName}' for include`);

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
                options.addAction?.(header, body, columnName);
        }
    });

    const matrix = [
        header,
        ...body
    ];
    return matrix;
}

export function successToMatrix(sucResults: SuccessResults, options: TransformData.resultsToMatrixOptions) {
    const sucAction = (header: TransformData.header, body: TransformData.body, columnName: TransformData.colname) => {
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
                throw new Error(`Column '${columnName}' is not defined for success data`);
        }
    };

    return resultsToMatrix(sucResults, {
        includeColumns: options.includeColumns,
        addAction: sucAction
    });
}

export function errsToMatrix(errResults: ErrorResults, options: TransformData.resultsToMatrixOptions) {
    const errAction = (header: TransformData.header, body: TransformData.body, columnName: TransformData.colname) => {
        switch (columnName) {
            case COLUMNS.error.name:
                const errors = Object.values(errResults).map(result => result.reason);
                addColumn(body, errors);
                break;
            default:
                throw new Error(`Column '${columnName}' is not defined for errors data`);
        }
    };

    return resultsToMatrix(errResults, {
        includeColumns: options.includeColumns,
        addAction: errAction
    });
}
