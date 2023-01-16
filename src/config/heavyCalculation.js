process.on("message",msg=>{
    const number = JSON.parse(msg)
    const numberGenerator = () =>{
        return Math.floor(Math.random() * (1000 - 1 + 1) + 1)
    } 
    const resultados = Array.from({length: number},()=>numberGenerator())
    let found = {}
    for (let i = 0; i < resultados.length; i++) {
        let keys = resultados[i].toString()
        found[keys] = ++found[resultados[i]] || 1
    }
    process.send(found)
})