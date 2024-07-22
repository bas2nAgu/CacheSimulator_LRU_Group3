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
        this.simulatedFlow = [];
        this.programFlow = [];
        this.simulated = false;
        this.visualizedSteps = 0; // Added to keep track of visualized steps
    }

    addProgramFlow(mmBlock) {
        this.programFlow.push(mmBlock);
    }

    simulate() {
        const newSimulatedFlow = []; // Temporary storage for new simulation steps
        const newProgramFlow = this.programFlow.slice(this.simulatedFlow.length);

        newProgramFlow.forEach(mmBlock => {
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

            newSimulatedFlow.push({ mmBlock, hit });
        });

        this.simulatedFlow = this.simulatedFlow.concat(newSimulatedFlow); // Append new steps to the simulated flow
        this.simulated = true;
    }

    nextStep() {
        if (this.visualizedSteps < this.simulatedFlow.length) {
            const step = this.simulatedFlow[this.visualizedSteps];
            const memoryBlockTable = document.getElementById('memory-block');
            const newRow = memoryBlockTable.insertRow();
            newRow.insertCell(0).textContent = step.mmBlock;
            newRow.insertCell(1).textContent = step.hit ? 'Yes' : '';
            newRow.insertCell(2).textContent = step.hit ? '' : 'Yes';

            // Add highlight class to the new row
            newRow.classList.add('highlight');

            // Remove highlight from the previous row if any
            if (memoryBlockTable.rows.length > 1) {
                const previousRow = memoryBlockTable.rows[memoryBlockTable.rows.length - 2];
                previousRow.classList.remove('highlight');
            }

            this.visualizedSteps++; // Increment visualized steps count
        }
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

let simulator = new CacheSimulator(4, 1, 10, 2); // Default values

function addProgramFlow() {
    const mmBlock = parseInt(document.getElementById('program-flow-input').value);
    if (!isNaN(mmBlock)) {
        simulator.addProgramFlow(mmBlock);
        document.getElementById('program-flow-display').textContent = simulator.programFlow.join(', ');
        document.getElementById('program-flow-input').value = '';
    }
}

function simulateCache() {
    const cacheSize = parseInt(document.getElementById('cache-size').value);
    const blockSize = parseInt(document.getElementById('block-size').value);
    const cacheAccessTime = parseInt(document.getElementById('cache-access-time').value);
    const memoryAccessTime = parseInt(document.getElementById('memory-access-time').value);

    if (!simulator.simulated) {
        simulator = new CacheSimulator(cacheSize, cacheAccessTime, memoryAccessTime, blockSize);
    }

    const newProgramFlow = [...document.getElementById('program-flow-display').textContent.split(', ').map(Number)];
    const newInputs = newProgramFlow.slice(simulator.programFlow.length);

    newInputs.forEach(mmBlock => simulator.addProgramFlow(mmBlock));
    simulator.simulate();

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

function nextStep() {
    if (!simulator || !simulator.simulated) {
        alert('Please run the simulation first.');
        return;
    }
    simulator.nextStep();
}

function resetSimulation() {
    simulator = new CacheSimulator(4, 1, 10, 2); // Reset with default values
    document.getElementById('program-flow-display').textContent = '';
    document.getElementById('memory-block').innerHTML = '';
    document.getElementById('result-display').style.display = 'none';
}
