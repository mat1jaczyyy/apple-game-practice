self.addEventListener("message", e => {
    let best = -1;
    
    let explore = function(node, apples = 0, last = 0) {
        if (apples > best) {
            best = apples;
            postMessage({best: best});
        }

        let result = apples;

        for (let i = last; i < e.data.comb.length; i++) {
            const v = e.data.comb[i];

            let can = true;
            for (const [vk, vv] of Object.entries(v)) {
                if (node[vk] < vv) {
                    can = false;
                    break;
                }
            }
            if (!can) continue;

            let next = {};
            let s = 0;
            for (const [vk, vv] of Object.entries(node)) {
                next[vk] = vv;
            }
            for (const [vk, vv] of Object.entries(v)) {
                next[vk] -= vv;
                s += vv;
            }
            
            postMessage({solving: i});
            let leaf = explore(next, apples + s, i);
            postMessage({solved: leaf});

            result = Math.max(result, leaf);
        }

        return result;
    };
    
    explore(e.data.cnt, e.data.points);
});
