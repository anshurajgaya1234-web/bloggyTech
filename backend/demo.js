const bcrypt = require("bcryptjs")
let hashedPwd;
async function genHashPwd(pwd){
    const salt = await bcrypt.genSalt(10) // this will hash salt value 2^10 time
    console.log("salt",salt);
     hashedPwd = await bcrypt.hash(pwd,salt);
    console.log("Original pwd",pwd)
    console.log("Hashed pwd",hashedPwd)
}

async function comparePwd(pwd){
    const result = await bcrypt.compare(pwd,hashedPwd)
    console.log("result",result);
}

async function run(){
    const pwd = "anshu"
    await genHashPwd(pwd)
    await comparePwd(pwd)
}
run()
// api hamesha json response deti hai