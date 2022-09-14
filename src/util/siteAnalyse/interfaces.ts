export interface Result {
    redirect: string | null;
}

export interface SuccessResult extends Result {
    value: Array<string>;
}

export interface ErrorResult extends Result {
    reason: string;
}

export interface SuccessResults {
    [url: string]: SuccessResult;
}

export interface ErrorResults {
    [url: string]: ErrorResult;
}

export interface Results {
    success: SuccessResults;
    errors: ErrorResults;
}

export namespace TransformData {
    export type colname = "url" | "values" | "redirect" | "error";

    export const COLUMNS = {
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

    export type header = Array<string | number | null>;
    export type body = Array<Array<any>>;

    export type includeColumns = Array<colname>;

    export interface addAction {
        (header: header, body: body, colname: colname): void;
    }

    export interface resultsToMatrixOptions {
        includeColumns: includeColumns;
        addAction?: addAction;
    }
}

namespace GenerateReport {

}