class LRUCache { 
    constructor(n) { 
        this.csize = n; 
        this.dq = []; 
        this.ma = new Map(); 
    } 
    
    refer(x) { 
        if (!this.ma.has(x)) { 
            if (this.dq.length === this.csize) { 
                const last = this.dq[this.dq.length - 1]; 
                this.dq.pop(); 
                this.ma.delete(last); 
            } 
        } else { 
            this.dq.splice(this.dq.indexOf(x), 1); 
        } 
    
        this.dq.unshift(x); 
        this.ma.set(x, 0); 
    } 
    
    display() { 
        document.getElementById('cache-content').innerText = this.dq.join(', ');
    } 
} 

let cache;

function initializeCache() {
    const size = document.getElementById('cache-size').value;
    cache = new LRUCache(parseInt(size));
    cache.display();
}

function referValue() {
    const value = document.getElementById('cache-value').value;
    if (cache) {
        cache.refer(parseInt(value));
        cache.display();
    } else {
        alert('Please initialize the cache first.');
    }
}

// Initialize the cache with the default size on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCache();
});