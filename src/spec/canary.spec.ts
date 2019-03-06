
import { foo } from './helpers/test.helper';

describe("A suite", function() {
    it("should pass canary test", function() {
        expect(foo).toEqual('bar');
    });
});
