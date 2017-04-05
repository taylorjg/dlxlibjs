const dlxlib = require('../build/index');
const matrices = require('./matrices');
const expect = require('chai').expect;

describe('dlxlib es6 tests', function() {

    it('solving an empty matrix returns an empty generator', function() {
        const generator = dlxlib.solutionGenerator(matrices.MATRIX_EMPTY);
        const iteratorResult = generator.next();
        expect(iteratorResult.done).to.be.true;
    });

    it('solving a matrix with one solution returns a generator with one solution', function() {
        const generator = dlxlib.solutionGenerator(matrices.MATRIX_ONE_SOLUTION);
        const iteratorResult1 = generator.next();
        expect(iteratorResult1.done).to.be.false;
        const iteratorResult2 = generator.next();
        expect(iteratorResult2.done).to.be.true;
    });

    it('solving a matrix with one solution returns a generator with the correct solution', function() {
        const generator = dlxlib.solutionGenerator(matrices.MATRIX_ONE_SOLUTION);
        const iteratorResult1 = generator.next();
        expect(iteratorResult1.value).to.deep.equal([0, 3, 4]);
    });
});
