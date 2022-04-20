import fetch from 'node-fetch';
//import dotenv from 'dotenv'; // import {} from 'dotenv/config' ? idk if these imports will work or not
import argv from 'yargs'; //const argv = require('yargs').argv;


const inputFileName = argv._[0];
const outputFileName = argv._[1];

const { writeFile } = require('fs').promises;

async function getData() {
  const data = JSON.stringify({
    query: 

    `query($pipe_id: ID!, $num_items: Int!, $cursor: String!) {
        cards(pipe_id: $pipe_id, first: $num_items, after: $cursor) {
          pageInfo {
          hasNextPage
          endCursor
          }
          edges {
            cursor
            node {
              title
              id
              path
              pipe {
                id
                name
                cards_count
              }
              fields {
                field {
                  id
                }
                array_value
                value
                
              }
            }
          }
        }
      }`,
      variables: `{
        "pipe_id": 674680,
        "num_items": 2,
        "cursor": "WyIyMDE4LTEyLTExIDIxOjEzOjQyLjcxMjQ2NjAwMCBVVEMiLCIxLjAiLDE3MTIzMTkxXQ",  
  }`,
});



  const response = await fetch(
    'https://app.pipefy.com/graphiql',
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDIwMTU3NTYsImVtYWlsIjoic2FtYXJhLmdoYXppQGdvb2RsYW5kLnRlY2giLCJhcHBsaWNhdGlvbiI6MzAwMTQ5MzAwfX0.auIxl5iVEU6SVGgPlu_SiMyumdOUDYPFE0sfc50r8ZP2DQVyjwDnhv6QNROQWTDPBFttP40rsPgfhz1F29H3Xg',
        'User-Agent': 'Node',
      },
    }
  );  //authorization needs to be a .env... process.env???

  const json = await response.json();
  getData();
}


function escapeCommas (data, token) {
    return data.map(row => {
      return row.map((value, index) => {
        return row[index] = value.replace(/,/gm, token);
      });
    });
  }

function arrayToCSV (data) {
    csv = data.map(row => Object.values(row));
    csv .unshift(Object.keys(data[0]));
    return `${csv.join('\n').replace(/,/g, '","')}`;
}

  function unescapeCommas (data, token) {
    return data.replace(new RegExp(`${token}`, 'g'), ',');
  }

async function writeCSV (fileName, data) {
    try {
        await writeFile(fileName, data, 'utf8');
    }   catch (err) {
        console.log(err);
        process.exit(1);
    }
}

(async () => {
    //const data = await parseJSONFile;   //wait this doesn't exist & also i'm not parsing?
    const escapeToken = '~~~~';
    const escapedData = escapeCommas(data, escapeToken);
    const escapedCSV = arrayToCSV(escapedData);
    const CSV = unescapeCommas(escapedCSV);
    await writeCSV(outputFileName, CSV);
    console.log(`Successfully converted ${outputFileName}!`);
  })();

  