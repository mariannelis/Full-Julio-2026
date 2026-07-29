const bcrtypt = require('bcryptjs');
async function run() {
    const saltRounds = await bcrtypt.genSalt(10);
    const hashpassword = await bcrtypt.hash('123456', saltRounds);
    console.log(hashpassword);
    const isMatch = await bcrtypt.compare('123456', hashpassword);
    console.log(isMatch);
}   
run();
