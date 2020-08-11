import { Pagination, SortCriteria } from '@models';
import * as moment from 'moment';

// Pass in array of keys for specific keys search
export function filterObjectArray(
    objArray: any[],
    term: any,
    keys?: string[]
): any[] {
    console.log(objArray);
    console.log(term);
    let arr: any[] = [];
    if (term) {
        objArray.forEach(obj => {
            let found = false;
            Object.keys(obj).forEach(k => {
                if ((keys && keys.indexOf(k) > -1) || !keys) {
                    if (
                        obj[k] === term ||
                        (typeof obj[k] === 'string' &&
                            obj[k].toLowerCase().indexOf(term.toLowerCase()) >
                                -1) ||
                        (typeof obj[k] === 'number' &&
                            obj[k].toString() === term) ||
                        (typeof obj[k] === 'number' &&
                            obj[k].toString().indexOf(term) > -1)
                    ) {
                        found = true;
                    }
                }
            });
            if (found) {
                arr.push(obj);
            }
        });
        console.log(arr);
        return arr;
    } else {
        return objArray;
    }
}

export function pageTable(objArray: any[], pagination: Pagination): any[] {
    if (objArray && objArray.length && pagination) {
        const first: number =
            pagination.currentPage > 1
                ? pagination.currentPage * pagination.numberPerPage -
                  pagination.numberPerPage
                : 0;
        console.log(first);
        const last: number = pagination.currentPage * pagination.numberPerPage;
        console.log(last);
        return objArray.slice(first, last);
    } else {
        return [];
    }
}

export function setPaging(
    objArrLen: number,
    pagination: Pagination
): Pagination {
    if (objArrLen > 0) {
        pagination['numberPerPage'] = pagination.numberPerPage
            ? pagination.numberPerPage
            : 20;
        pagination['totalPages'] = Math.ceil(
            objArrLen / pagination.numberPerPage
        );
        pagination['currentPage'] =
            pagination.currentPage && pagination.currentPage > 1
                ? pagination.currentPage
                : 1;
        pagination['previousPage'] =
            pagination.currentPage > 1 ? pagination.currentPage - 1 : null;
        pagination['nextPage'] =
            pagination.totalPages > pagination.currentPage
                ? pagination.currentPage + 1
                : null;
        pagination['firstRecord'] =
            pagination.currentPage * pagination.numberPerPage -
            pagination.numberPerPage +
            1;
        pagination['lastRecord'] =
            pagination.currentPage * pagination.numberPerPage > objArrLen
                ? objArrLen
                : pagination.currentPage * pagination.numberPerPage;
    } else {
        pagination['numberPerPage'] = pagination.numberPerPage
            ? pagination.numberPerPage
            : 20;
        pagination['totalPages'] = 0;
        pagination['currentPage'] = null;
        pagination['previousPage'] = null;
        pagination['nextPage'] = null;
        pagination['firstRecord'] = null;
        pagination['lastRecord'] = null;
    }
    console.log(pagination);
    return pagination;
}

export function sortTable(objArray: any[], sort: SortCriteria): any[] {
    if (objArray.length && sort) {
        objArray.sort((a, b) => {
            let x: any;
            let y: any;
            if (sort.col.toLowerCase().indexOf('date') > -1) {
                x = moment(a[sort.col]).format('x');
                y = moment(b[sort.col]).format('x');
            } else {
                x = a[sort.col];
                y = b[sort.col];
            }
            if (typeof x === 'string') {
                x = x.toLowerCase();
            }
            if (typeof y === 'string') {
                y = y.toLowerCase();
            }
            if (sort.dir === 'desc') {
                return x > y ? -1 : 1;
            } else {
                return x < y ? -1 : 1;
            }
        });
    }
    return objArray;
}

export function isToday(obj1: any, obj2: any): boolean {
    return (
        obj1.day === obj2.day &&
        obj1.year === obj2.year &&
        obj1.month === obj2.month
    );
}
