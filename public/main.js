    
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
      constructor(blockSize, mmSize, cacheSize, missPenalty) {
          this.blockSize = blockSize;
          this.mmSize = mmSize;
          this.cacheSize = cacheSize;
          this.missPenalty = missPenalty;
          this.cache = new Map();
          this.hits = 0;
          this.misses = 0;
          this.accessTime = 1;
      }
  
      simulate(programFlow) {
          programFlow.forEach(address => {
              const blockAddress = Math.floor(address / this.blockSize);
              if (this.cache.has(blockAddress)) {
                  this.hits++;
                  this.cache.delete(blockAddress);
                  this.cache.set(blockAddress, true);
              } else {
                  this.misses++;
                  if (this.cache.size == this.cacheSize) {
                      this.cache.delete(this.cache.keys().next().value);
                  }
                  this.cache.set(blockAddress, true);
              }
          });
      }
  
      getResults() {
          const totalAccesses = this.hits + this.misses;
          const totalMissPenalty = this.misses * this.missPenalty;
          const totalAccessTime = totalAccesses + totalMissPenalty;
          const avgAccessTime = totalAccessTime / totalAccesses;
          return {
              hits: this.hits,
              misses: this.misses,
              totalMissPenalty: totalMissPenalty,
              avgAccessTime: avgAccessTime,
              totalAccessTime: totalAccessTime,
              cacheSnapshot: Array.from(this.cache.keys())
          };
      }
  }
  
  function simulateCache() {
      const blockSize = parseInt(document.getElementById('block-size').value);
      const mmSize = parseInt(document.getElementById('mm-size').value);
      const cacheSize = parseInt(document.getElementById('cache-size').value);
      const programFlow = document.getElementById('program-flow').value.split(',').map(Number);
      const missPenalty = parseInt(document.getElementById('miss-penalty').value);
  
      const simulator = new CacheSimulator(blockSize, mmSize, cacheSize, missPenalty);
      simulator.simulate(programFlow);
  
      const results = simulator.getResults();
      const resultsText = `
          Cache Hits: ${results.hits}
          Cache Misses: ${results.misses}
          Miss Penalty: ${results.totalMissPenalty}
          Average Memory Access Time: ${results.avgAccessTime.toFixed(2)} cycles
          Total Memory Access Time: ${results.totalAccessTime} cycles
          Cache Snapshot: ${results.cacheSnapshot.join(', ')}
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

