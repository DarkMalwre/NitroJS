require("ts-node").register({ transpileOnly: true });

console.log(JSON.stringify(require(process.argv[2])));