import * as fs from 'fs';
const filepath = './data.json';




function readData() {
  fs.readFile(filepath, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      const customer = JSON.parse(jsonString);
      console.log("Customer address is:", customer.address); // => "Customer address is: Infinity Loop Drive"
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
    // console.log("File data:", jsonString);
  })
}

function writeData(obj) {
  const jsonString = JSON.stringify(obj);
  fs.writeFile('./newCustomer.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
  })
}
