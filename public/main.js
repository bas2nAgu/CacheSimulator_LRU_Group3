class CacheSimulator {
    constructor(cacheSize, cacheAccessTime, memoryAccessTime, blockSize) {
        this.cacheSize = cacheSize;
        this.cacheAccessTime = cacheAccessTime;
        this.memoryAccessTime = memoryAccessTime;
        this.blockSize = blockSize;
        this.cache = new Array(cacheSize).fill(null).map((_, index) => ({
            mmBlock: null,
            age: 0,
            cacheBlock: index
        }));
        this.hits = 0;
        this.misses = 0;
    }

    simulate(programFlow) {
        programFlow.forEach(mmBlock => {
            let hit = false;

            // Check for hit
            this.cache.forEach(block => {
                if (block.mmBlock === mmBlock) {
                    hit = true;
                    this.hits++;
                    // Get the age of the accessed block
                    const accessedAge = block.age;
                    // Increment the age of blocks with age less than accessedAge
                    this.cache.forEach(b => {
                        if (b.age < accessedAge) {
                            b.age++;
                        }
                    });
                    // Reset the age of the accessed block
                    block.age = 0;
                }
            });

            // Handle miss
            if (!hit) {
                this.misses++;
                // Find the oldest block to replace
                let oldestBlock = this.cache.reduce((oldest, block) => {
                    return block.age > oldest.age ? block : oldest;
                }, this.cache[0]);

                // Replace the oldest block with the new value
                oldestBlock.mmBlock = mmBlock;
                oldestBlock.age = 0;

                // Increment the age of all other blocks
                this.cache.forEach(block => {
                    if (block !== oldestBlock) {
                        block.age++;
                    }
                });
            }
        });
    }

    getResults() {
        const totalAccesses = this.hits + this.misses;
        const totalCacheAccessTime = this.hits * this.cacheAccessTime;
        const totalMemoryAccessTime = this.misses * (this.cacheAccessTime + this.memoryAccessTime);
        const missPenalty = (2 * this.cacheAccessTime) + (this.blockSize * this.memoryAccessTime);
        const totalAccessTime = (this.hits * this.blockSize * this.cacheAccessTime) + (this.misses * (missPenalty + this.cacheAccessTime));
        const avgAccessTime = ((this.hits / totalAccesses) * this.cacheAccessTime) + ((this.misses / totalAccesses) * missPenalty);
        const cacheSnapshot = this.cache.map(block => {
            return `Cache Block: ${block.cacheBlock}, MM Block: ${block.mmBlock}`;
        });

        return {
            hits: this.hits,
            misses: this.misses,
            missPenalty: missPenalty,
            avgAccessTime: avgAccessTime,
            totalAccessTime: totalAccessTime,
            cacheSnapshot: cacheSnapshot
        };
    }
}

    function simulateCache() {
        const cacheSize = parseInt(document.getElementById('cache-size').value);
        const blockSize = parseInt(document.getElementById('block-size').value);
        const programFlow = document.getElementById('program-flow').value.split(',').map(Number);
        const cacheAccessTime = parseInt(document.getElementById('cache-access-time').value);
        const memoryAccessTime = parseInt(document.getElementById('memory-access-time').value);

        const simulator = new CacheSimulator(cacheSize, cacheAccessTime, memoryAccessTime, blockSize);
        simulator.simulate(programFlow);

        const results = simulator.getResults();
        const resultsText = 
    `Cache Hits: ${results.hits}
    Cache Misses: ${results.misses}
    Miss Penalty: ${results.missPenalty} ns
    Average Memory Access Time: ${results.avgAccessTime.toFixed(2)} ns
    Total Memory Access Time: ${results.totalAccessTime} ns
    Cache Snapshot: \n     ${results.cacheSnapshot.join('\n     ')}`;
        document.getElementById('results').textContent = resultsText;

        document.getElementById('result-display').style.display = 'block';
    }

    function saveResults() {
        const resultsText = document.getElementById('results').textContent;
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cache_simulation_results.txt';
        link.click();
    }