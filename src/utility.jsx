// get a JSON file and use setContent to content from file, or else to false
export const getJsonFile = (file, setContent) => {
  // console.log("getJsonFile - file: ", file);
  fetch(file)
    .then(function (response) {
      // console.log(response);
      if (response.type === "cors" || response.status !== 200) {
        setContent(false);
        return;
      }
      response.text().then(function (text) {
        const json = JSON.parse(text);
        // console.log("fetched: file=", file, "json=", json);
        setContent(json);
      });
    })
    .catch((err) => {
      console.log("getJsonFile - err: ", err);
      setContent(false);
    });
};
