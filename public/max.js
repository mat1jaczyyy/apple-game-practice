let ALL_COMBINATIONS = [
    {9: 1, 1: 1},
    {8: 1, 2: 1},
    {8: 1, 1: 2},
    {7: 1, 3: 1},
    {7: 1, 2: 1, 1: 1},
    {7: 1, 1: 3},
    {6: 1, 4: 1},
    {6: 1, 3: 1, 1: 1},
    {6: 1, 2: 2},
    {6: 1, 2: 1, 1: 2},
    {6: 1, 1: 4},
    {5: 2},
    {5: 1, 4: 1, 1: 1},
    {5: 1, 3: 1, 2: 1},
    {5: 1, 3: 1, 1: 2},
    {5: 1, 2: 2, 1: 1},
    {5: 1, 2: 1, 1: 3},
    {5: 1, 1: 5},
    {4: 2, 2: 1},
    {4: 2, 1: 2},
    {4: 1, 3: 2},
    {4: 1, 3: 1, 2: 1, 1: 1},
    {4: 1, 3: 1, 1: 3},
    {4: 1, 2: 3},
    {4: 1, 2: 2, 1: 2},
    {4: 1, 2: 1, 1: 4},
    {4: 1, 1: 6},
    {3: 3, 1: 1},
    {3: 2, 2: 2},
    {3: 2, 2: 1, 1: 2},
    {3: 2, 1: 4},
    {3: 1, 2: 3, 1: 1},
    {3: 1, 2: 2, 1: 3},
    {3: 1, 2: 1, 1: 5},
    {3: 1, 1: 7},
    {2: 5},
    {2: 4, 1: 2},
    {2: 3, 1: 4},
    {2: 2, 1: 6},
    {2: 1, 1: 8},
    {1: 10}
];

self.addEventListener("message", e => {
    let known = [];
    let best = 0;
    //console.log("worker start");
    //console.log(e);
    let explore = function(node, apples = 0) {
        if (apples > best) {
            best = apples;
            //console.log(`new best = ${best}`);
            //console.log(`new best = ${best}`);
            postMessage({best: best});
        }
        if (best == e.data.target) return;

        for (const v of ALL_COMBINATIONS) {
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
            let str = `${next[1]} ${next[2]} ${next[3]} ${next[4]} ${next[5]} ${next[6]} ${next[7]} ${next[8]} ${next[9]}`;
            if (known.includes(str)) continue;

            known.push(str);
            explore(next, apples + s);
        }
    };
    
    //console.log(`your leftover task is ${JSON.stringify(leftover)}`);

    explore(e.data.cnt);
    //console.log(`done best = ${best}`);

    postMessage({best: best});
});
