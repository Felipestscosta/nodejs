import http from "node:http";
import fs from "node:fs";
import { parse } from "csv-parse";


const getFileCSV = new URL("../samples-tasks.csv", import.meta.url);

const server = http.createServer(async (req, res) => {
    
    const stream = fs.createReadStream(getFileCSV)

    const csvParse =  parse({
        delimiter: ',',
        skipEmptyLines: true,
        fromLine: 2

    })
    const lineParse = stream.pipe(csvParse)


    for await (const line of lineParse){
        const [ title, description ] = line

        console.log(title)

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        })
        
    }


});

server.listen(3334);
