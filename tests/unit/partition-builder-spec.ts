import * as assert from 'assert';
import { PartitionBuilder } from '../../source/partitions/partition-builder'

describe('"PartitionBuilder" unit tests', () => {
    const xResolver = {
        "partitionSize": 10n,
        "resolvePartitionIdentity": (val: bigint) => Promise.resolve(val % xResolver.partitionSize),
        "resolvePartitionName": (val: bigint) => Promise.resolve((val - (val % xResolver.partitionSize)).toString())
    }

    it('should return success when presented with correct data for 1 dimension', async () => {
        //Setup
        const payload = "Laukik";
        const xIndex = 1n;
        const target = new PartitionBuilder([xResolver]);
        const data = new Map<Array<bigint>, string>();
        data.set([xIndex], payload);

        //Invoke
        const results = await target.build(data);

        //Validate
        assert.deepEqual(results.failed.size, 0);
        assert.deepEqual(results.suceeded.size, 1);
        assert.deepEqual(Array.from(results.suceeded.keys()), ["0"]);
        assert.deepEqual(results.suceeded.get("0")?.size, 1);
        assert.deepEqual(Array.from(<IterableIterator<bigint>>results.suceeded.get("0")?.keys()), [xIndex]);
        assert.deepEqual(results.suceeded.get("0")?.get(1n), payload);
    });

    it('should return success when presented with correct data for 1 dimension with multiple sets', async () => {
        //Setup
        const payload = "Laukik";
        const target = new PartitionBuilder([xResolver]);
        const data = new Map<Array<bigint>, string>();
        for (let index = 0n; index < 100; index++) {
            data.set([index], payload + index.toString());
        }

        //Invoke
        const results = await target.build(data);

        //Validate
        assert.deepEqual(results.failed.size, 0);
        assert.deepEqual(results.suceeded.size, 10);
        assert.deepEqual(Array.from(results.suceeded.keys()), ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"]);
        assert.deepEqual(results.suceeded.get("0")?.size, 10);
        assert.deepEqual(results.suceeded.get("10")?.size, 10);
        assert.deepEqual(results.suceeded.get("20")?.size, 10);
        assert.deepEqual(results.suceeded.get("30")?.size, 10);
        assert.deepEqual(results.suceeded.get("40")?.size, 10);
        assert.deepEqual(results.suceeded.get("50")?.size, 10);
        assert.deepEqual(results.suceeded.get("60")?.size, 10);
        assert.deepEqual(results.suceeded.get("70")?.size, 10);
        assert.deepEqual(results.suceeded.get("80")?.size, 10);
        assert.deepEqual(results.suceeded.get("90")?.size, 10);
        assert.deepEqual(Array.from(<IterableIterator<bigint>>results.suceeded.get("0")?.keys()), [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n]);
        assert.deepEqual(Array.from(<IterableIterator<bigint>>results.suceeded.get("90")?.keys()), [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n]);
        assert.deepEqual(results.suceeded.get("90")?.get(0n), payload + "90");
        assert.deepEqual(results.suceeded.get("90")?.get(9n), payload + "99");
    });

    it('should return failure when presented with in-correct data for 1 dimension', async () => {
        //Setup
        xResolver.resolvePartitionIdentity = (val: bigint) => Promise.resolve(val);
        const payload = "Laukik";
        const xIndex = 11n;
        const target = new PartitionBuilder([xResolver]);
        const data = new Map<Array<bigint>, string>();
        data.set([xIndex], payload);

        //Invoke
        const results = await target.build(data);

        //Validate
        assert.deepEqual(results.failed.size, 1);
        assert.deepEqual(results.suceeded.size, 0);
        assert.deepEqual(Array.from(results.failed.keys())[0], [xIndex]);
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[0])?.data, payload);
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[0])?.error?.message, "invalid argument. Subscripts must not exceed array dimensions. Subscript: 0. Value: `11`.");
    });

    it('should return failure when configured incorrectly for 1 dimension', async () => {
        //Setup
        const payload = "Laukik";
        const xIndex = 11n;
        const yIndex = 11n;
        const target = new PartitionBuilder([xResolver]);
        const data = new Map<Array<bigint>, string>();
        data.set([xIndex, yIndex], payload);

        //Invoke
        const results = await target.build(data);

        //Validate
        assert.deepEqual(results.failed.size, 1);
        assert.deepEqual(results.suceeded.size, 0);
        assert.deepEqual(Array.from(results.failed.keys())[0], [xIndex, yIndex]);
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[0])?.data, payload);
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[0])?.error?.message, "Invalid dimensions: Must be equal to resolvers(1).");
    });

    it('should return combination of sucees and failure when presented with partially correct data/config for 1 dimension', async () => {
        //Setup
        xResolver.resolvePartitionIdentity = (val: bigint) => Promise.resolve(val);
        const xIndex = 11n;
        const yIndex = 11n;
        const target = new PartitionBuilder([xResolver]);
        const data = new Map<Array<bigint>, string>();
        data.set([xIndex, yIndex], "Bad cause its multi dimensional config issue");
        data.set([xIndex], "Bad cause resolver is not implemented correctly");
        data.set([0n], "Good");

        //Invoke
        const results = await target.build(data);

        //Validate
        assert.deepEqual(results.failed.size, 2);
        assert.deepEqual(results.suceeded.size, 1);
        assert.deepEqual(Array.from(results.failed.keys())[0], [xIndex, yIndex]);
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[0])?.data, "Bad cause its multi dimensional config issue");
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[0])?.error?.message, "Invalid dimensions: Must be equal to resolvers(1).");
        assert.deepEqual(Array.from(results.failed.keys())[1], [xIndex]);
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[1])?.data, "Bad cause resolver is not implemented correctly");
        assert.deepEqual(results.failed.get(Array.from(results.failed.keys())[1])?.error?.message, "invalid argument. Subscripts must not exceed array dimensions. Subscript: 0. Value: `11`.");
        assert.deepEqual(Array.from(results.suceeded.keys()), ["0"]);
        assert.deepEqual(results.suceeded.get("0")?.size, 1);
        assert.deepEqual(Array.from(<IterableIterator<bigint>>results.suceeded.get("0")?.keys()), [0n]);
        assert.deepEqual(results.suceeded.get("0")?.get(0n), "Good");
    });

    it('should update with success when data has duplicates for 1 dimension', async () => {
        //Setup
        const payload = "I should be updated value as i am last in sequence.";
        const xIndex = 1n;
        const target = new PartitionBuilder([xResolver]);
        const data = new Map<Array<bigint>, string>();
        data.set([xIndex], "Laukik1");
        data.set([xIndex], payload);

        //Invoke
        const results = await target.build(data);

        //Validate
        assert.deepEqual(data.size, 2);
        assert.deepEqual(results.failed.size, 0);
        assert.deepEqual(results.suceeded.size, 1);
        assert.deepEqual(Array.from(results.suceeded.keys()), ["0"]);
        assert.deepEqual(results.suceeded.get("0")?.size, 1);
        assert.deepEqual(Array.from(<IterableIterator<bigint>>results.suceeded.get("0")?.keys()), [xIndex]);
        assert.deepEqual(results.suceeded.get("0")?.get(1n), payload);
    });
});