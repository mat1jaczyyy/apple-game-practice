function* gen(target = 10, min = 1, max = 9) {
    if (typeof gen.stack == 'undefined') {
        gen.stack = [];
    }

    if (target == 0) {
        let add = [...gen.stack];
        add.sort((a, b) => b - a);
        yield add;
    }

    for (let i = min; i <= Math.min(target, max); i++) {
        gen.stack.push(i);
        yield* gen(target - i, i);
        gen.stack.pop();
    }
}

let c = Array.from(gen());
c.sort((a, b) => a.length - b.length);

let ALL_COMBINATIONS = c.map(i => {
    let ret = {};
    for (const j of i) {
        ret[j] = (ret[j] || 0) + 1;
    }
    return ret; 
});
let ALL_STRINGS = c.map(i => i.join(''));

let CNT = {};
let TREE = {};
let STACK = [];
let POINTS = 0;

let LEAF = function() {
    let leaf = TREE;
    for (const i of STACK)
        leaf = leaf[i];

    return leaf;
}

let MAX_SEARCH = null;
let MAX_SEARCH_KILL = function() {
    if (MAX_SEARCH) {
        MAX_SEARCH.terminate();
        MAX_SEARCH = null;
    }
};

let MAX_SEARCH_START = function() {
    MAX_SEARCH_KILL();
    MAX_SEARCH = new Worker('search.js');

    MAX_SEARCH.addEventListener("message", e => {
        if (e.data.best !== undefined) {
            postMessage({best: e.data.best});

        } else if (e.data.solving !== undefined) {
            LEAF()[e.data.solving] = {};
            STACK.push(e.data.solving);

        } else if (e.data.solved !== undefined) {
            LEAF().score = e.data.solved;
            STACK.pop();
        }
    })

    MAX_SEARCH.postMessage({cnt: CNT, comb: ALL_COMBINATIONS, points: POINTS});
}

self.addEventListener("message", e => {
    if (e.data.cnt !== undefined) {
        MAX_SEARCH_KILL();
        CNT = e.data.cnt;
        TREE = {};
        STACK = [];
        POINTS = 0;
        MAX_SEARCH_START();

    } else if (e.data.action !== undefined) {
        let action = ALL_STRINGS.indexOf(e.data.action);
        //console.log(`action: ${action} ${e.data.action}`);
        //console.log(`status: ${TREE[action]}`)

        for (const i of e.data.action)
            CNT[parseInt(i)]--;

        POINTS += e.data.action.length;
            
        if (TREE[action] === undefined || TREE[action].score === undefined) {
            MAX_SEARCH_KILL();
            TREE = {};
            STACK = [];
            
            MAX_SEARCH_START();
        
        } else if (TREE[action].score >= 0) {
            MAX_SEARCH_KILL();
            TREE = TREE[action];
            
            console.log(`done!`)

            postMessage({best: TREE.score});
        }
    }
});