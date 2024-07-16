    
    function navigateToPost(url) {
        if(!event.target.classList.contains('up_vote') && !event.target.classList.contains('down_vote') && !event.target.classList.contains('delete-post-btn')) {
            window.location.href = url;
        }
      }
      function openForm() {
            
        document.getElementById("popup").style.display = "block";
      }
      
      function closeForm() {
        document.getElementById("popup").style.display = "none";
      }

      function handleDelete(event) {
        event.stopPropagation();
        openForm();
    }
    
    class CacheSimulator {
        constructor(cacheSize, missPenalty) {
            this.cacheSize = cacheSize;
            this.missPenalty = missPenalty;
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
            const totalMissPenalty = this.misses * this.missPenalty;
            const totalAccessTime = totalAccesses + totalMissPenalty;
            const avgAccessTime = totalAccessTime / totalAccesses;
            const cacheSnapshot = this.cache.map(block => {
                return `Cache Block: ${block.cacheBlock}, MM Block: ${block.mmBlock}`;
            });
    
            return {
                hits: this.hits,
                misses: this.misses,
                totalMissPenalty: totalMissPenalty,
                avgAccessTime: avgAccessTime,
                totalAccessTime: totalAccessTime,
                cacheSnapshot: cacheSnapshot
            };
        }
    }
    
    function simulateCache() {
        const cacheSize = parseInt(document.getElementById('cache-size').value);
        const programFlow = document.getElementById('program-flow').value.split(',').map(Number);
        const missPenalty = parseInt(document.getElementById('miss-penalty').value);
    
        const simulator = new CacheSimulator(cacheSize, missPenalty);
        simulator.simulate(programFlow);
    
        const results = simulator.getResults();
        const resultsText = `
        Cache Hits: ${results.hits}
        Cache Misses: ${results.misses}
        Miss Penalty: ${results.totalMissPenalty}
        Average Memory Access Time: ${results.avgAccessTime.toFixed(2)} cycles
        Total Memory Access Time: ${results.totalAccessTime} cycles
        Cache Snapshot: ${results.cacheSnapshot.join('\n                        ')}
        `;
        document.getElementById('results').textContent = resultsText;
    }
  
  function saveResults() {
      const resultsText = document.getElementById('results').textContent;
      const blob = new Blob([resultsText], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'cache_simulation_results.txt';
      link.click();
  }

