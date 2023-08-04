const TOKEN = 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;
const GIST_ID = af76bd3e94b62b3ee74f98a75270b280;
const GIST_FILENAME = "db.json";

/* 
 * Reads the JSON file inside of the gist
 */
async function getData() {
  const req = await fetch(`https://api.github.com/gists/${GIST_ID}`);
  const gist = await req.json();
  return JSON.parse(gist.files[GIST_FILENAME].content);
}

/* 
 * Puts the data you want to store back into the gist
 */
async function setData(data) {
  const req = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data),
        },
      },
    }),
  });

  return req.json();
}
