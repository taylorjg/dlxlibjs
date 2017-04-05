import { DataObject } from './dataObject';
import { ColumnObject } from './columnObject';

export const solve = (matrix, onSearchStep, onSolutionFound, n) => {
    const generator = solutionGenerator(matrix, onSearchStep, onSolutionFound);
    const max = n || Number.MAX_VALUE;
    const solutions = [];
    for (let i = 0; i < max; i++) {
        const iteratorResult = generator.next();
        if (iteratorResult.done) break;
        solutions.push(iteratorResult.value);
    }
    return solutions;
};

export const solutionGenerator = function* (matrix, onSearchStep, onSolutionFound) {
    const root = buildInternalStructure(matrix);
    const searchState = new SearchState(root, onSearchStep, onSolutionFound);
    yield* search(searchState);
};

const buildInternalStructure = matrix => {

    const root = new ColumnObject();
    const colIndexToListHeader = new Map();

    matrix.forEach((row, rowIndex) => {
        let firstDataObjectInThisRow = null;
        row.forEach((col, colIndex) => {
            if (rowIndex === 0) {
                const listHeader = new ColumnObject();
                root.appendColumnHeader(listHeader);
                colIndexToListHeader.set(colIndex, listHeader);
            }
            if (col) {
                const listHeader = colIndexToListHeader.get(colIndex);
                const dataObject = new DataObject(listHeader, rowIndex);
                if (firstDataObjectInThisRow)
                    firstDataObjectInThisRow.appendToRow(dataObject);
                else
                    firstDataObjectInThisRow = dataObject;
            }
        });
    });

    return root;
};

function* search(searchState) {

    searchState.searchStep();

    if (searchState.isEmpty()) {
        if (searchState.currentSolution.length) {
            searchState.solutionFound();
            yield searchState.currentSolution.slice().sort();
        }
        return;
    }

    const c = chooseColumnWithFewestRows(searchState);
    coverColumn(c);
    for (let r = c.down; r !== c; r = r.down) {
        searchState.pushRowIndex(r.rowIndex);
        r.loopRight(j => coverColumn(j.listHeader));
        yield* search(searchState);
        r.loopLeft(j => uncoverColumn(j.listHeader));
        searchState.popRowIndex();
    }
    uncoverColumn(c);
}

const chooseColumnWithFewestRows = searchState => {
    let chosenColumn = null;
    searchState.root.loopNext(column => {
        if (!chosenColumn || column.numberOfRows < chosenColumn.numberOfRows) {
            chosenColumn = column;
        }
    });
    return chosenColumn;
};

const coverColumn = c => {
    c.unlinkColumnHeader();
    c.loopDown(i => i.loopRight(j => j.listHeader.unlinkDataObject(j)));
};

const uncoverColumn = c => {
    c.loopUp(i => i.loopLeft(j => j.listHeader.relinkDataObject(j)));
    c.relinkColumnHeader();
};

class SearchState {

    constructor(root, onSearchStep, onSolutionFound) {
        this.root = root;
        this.onSearchStep = onSearchStep;
        this.onSolutionFound = onSolutionFound;
        this.currentSolution = [];
    }

    isEmpty() {
        return this.root.nextColumnObject === this.root;
    }

    pushRowIndex(rowIndex) {
        this.currentSolution.push(rowIndex);
    }

    popRowIndex() {
        this.currentSolution.pop();
    }

    searchStep() {
        if (this.onSearchStep) {
            this.onSearchStep(this.currentSolution);
        }
    }

    solutionFound() {
        if (this.onSolutionFound) {
            this.onSolutionFound(this.currentSolution);
        }
    }
}
