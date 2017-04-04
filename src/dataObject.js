export class DataObject {

    constructor(listHeader, rowIndex) {
        this.listHeader = listHeader;
        this.rowIndex = rowIndex;
        this.up = this;
        this.down = this;
        this.left = this;
        this.right = this;
        if (listHeader) {
            listHeader.addDataObject(this);
        }
    }

    appendToRow(dataObject) {
        this.left.right = dataObject;
        dataObject.right = this;
        dataObject.left = this.left;
        this.left = dataObject;
    }

    appendToColumn(dataObject) {
        this.up.down = dataObject;
        dataObject.down = this;
        dataObject.up = this.up;
        this.up = dataObject;
    }

    unlinkFromColumn() {
        this.down.up = this.up;
        this.up.down = this.down;
    }

    relinkIntoColumn() {
        this.down.up = this;
        this.up.down = this;
    }

    loopUp(fn) { this.loop(fn, 'up'); }
    loopDown(fn) { this.loop(fn, 'down'); }
    loopLeft(fn) { this.loop(fn, 'left'); }
    loopRight(fn) { this.loop(fn, 'right'); }
    
    loop(fn, propName) {
        for (let next = this[propName]; next !== this; next = next[propName]) {
            fn(next);
        }
    }
}
