import * as React from 'react'

export default class ParentPage extends React.Component {

    componentDidUpdate(previousProps, previousState) {
        //Fix to prevent horizontal scroll on DetailList
        window.dispatchEvent(new Event('resize'));
        if (previousState.isModalSelection !== this.state.isModalSelection) {
            this._selection.setModal(this.state.isModalSelection);
        }
    }

    _onColumnClick = (params, ev, column) => {
        if (!Array.isArray(params.dataName) || params.dataName.length > 2 || params.dataName.length < 1){
            console.error("'params.dataName' should be array with one or two arguments only")
            return
        }
        const columns = this.state[params.colName]
        const items = params.dataName.length > 1 ? this.state[params.dataName[0]][params.dataName[1]] : this.state[params.dataName[0]]
        //var a = function(x, s) { if (s.length > 1) { return a(x[s[0]], s.slice(1, s.length)) } else { return x[s[0]] } }
        
        let newItems = items.slice();
        const newColumns = columns.slice();
        const currColumn = newColumns.filter((currCol, idx) => {
            return column.key === currCol.key;
        })[0];
        newColumns.forEach((newCol) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        newItems = this._sortItems(newItems, currColumn.fieldName || '', currColumn.isSortedDescending);

        if (params.dataName.length > 1) {
            this.setState({
                [params.dataName[0]]: {
                    ...this.state[params.dataName[0]],
                    [params.dataName[1]]: newItems
                }
            })
        } else {
            this.setState({
                [params.colName]: newColumns,
                [params.dataName]: newItems
            });
        }
    };

    _sortItems = (items, sortBy, descending = false) => {
        if (descending) {
            return items.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                return 0;
            });
        } else {
            return items.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return 1;
                }
                return 0;
            });
        }
    };
}
