import { expect } from 'chai';
import { solve } from '../lib/index';
import * as M from './matrices';

describe('#solve tests', function() {

    it('solving an empty matrix returns an empty array of solutions', function() {
        const solutions = solve(M.MATRIX_EMPTY);
        expect(solutions).to.be.empty;
    });

    it('solving a matrix with one solution returns an array with one solution', function() {
        const solutions = solve(M.MATRIX_WITH_ONE_SOLUTION);
        expect(solutions).to.have.lengthOf(1);
    });

    it('solving a matrix with one solution returns an array with the correct solution', function() {
        const solutions = solve(M.MATRIX_WITH_ONE_SOLUTION);
        const solution = solutions[0];
        expect(solution).to.deep.equal([0, 3, 4]);
    });

    it('solving a matrix with three solutions returns an array with three solutions', function() {
        const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS);
        expect(solutions).to.have.lengthOf(3);
    });

    it('solving a matrix with three solutions returns an array with the correct three solutions', function() {
        const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS);
        expect(solutions).to.deep.include.members([[0, 3, 4]]);
        expect(solutions).to.deep.include.members([[1, 2]]);
        expect(solutions).to.deep.include.members([[2, 4, 5]]);
    });

    it('solving a matrix with three solutions but n set to two returns an array with two solutions', function() {
        const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS, null, null, 2);
        expect(solutions).to.have.lengthOf(2);
    });

    it('solving a matrix with three solutions but n set to five returns an array with three solutions', function() {
        const solutions = solve(M.MATRIX_WITH_THREE_SOLUTIONS, null, null, 5);
        expect(solutions).to.have.lengthOf(3);
    });

    // TODO: add test(s) re onSearchStep
    // TODO: add test(s) re onSolutionFound
});
