import { expect } from 'chai';
import { solutionGenerator } from '../src';
import * as M from './matrices';

describe('#solutionGenerator tests', function() {

    it('solving an empty matrix returns an empty generator', function() {
        const generator = solutionGenerator(M.MATRIX_EMPTY);
        const solutions = Array.from(generator);
        expect(solutions).to.be.empty;
    });

    it('solving a matrix with one solution returns a generator with one solution', function() {
        const generator = solutionGenerator(M.MATRIX_WITH_ONE_SOLUTION);
        const solutions = Array.from(generator);
        expect(solutions).to.have.lengthOf(1);
    });

    it('solving a matrix with one solution returns a generator with the correct solution', function() {
        const generator = solutionGenerator(M.MATRIX_WITH_ONE_SOLUTION);
        const solutions = Array.from(generator);
        const solution = solutions[0];
        expect(solution).to.deep.equal([0, 3, 4]);
    });

    it('solving a matrix with three solutions returns a generator with three solutions', function() {
        const generator = solutionGenerator(M.MATRIX_WITH_THREE_SOLUTIONS);
        const solutions = Array.from(generator);
        expect(solutions).to.have.lengthOf(3);
    });

    it('solving a matrix with three solutions returns a generator with the correct three solutions', function() {
        const generator = solutionGenerator(M.MATRIX_WITH_THREE_SOLUTIONS);
        const solutions = Array.from(generator);
        expect(solutions).to.deep.include.members([[0, 3, 4]]);
        expect(solutions).to.deep.include.members([[1, 2]]);
        expect(solutions).to.deep.include.members([[2, 4, 5]]);
    });

    // TODO: add test(s) re onSearchStep
    // TODO: add test(s) re onSolutionFound
});
