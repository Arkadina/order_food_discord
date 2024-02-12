const ExcelJS = require("exceljs");
const fs = require("fs");

async function writeDataToExecel(data) {
  if (fs.existsSync("example.xlsx")) {
    const oldWorkbook = new ExcelJS.Workbook();
    await oldWorkbook.xlsx.readFile("example.xlsx");
    const oldWoorksheet = oldWorkbook.getWorksheet("Orders");

    const rows = [];

    oldWoorksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        rows.push({
          id: row.values[1],
          food: row.values[2],
          drink: row.values[3],
        });
      }
    });

    rows.push({
      id: rows[rows.length - 1].id + 1,
      food: data.drink,
      drink: data.drink,
    });

    await createNewSheet(rows);
    return;
  }

  await createNewSheet([
    {
      id: 1,
      food: data.food,
      drink: data.drink,
    },
  ]);
}

async function createNewSheet(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Orders", {
    properties: {
      tabColor: {
        argb: "FFC0000",
      },
    },
    views: [{ showGridLines: true }],
  });

  worksheet.columns = [
    {
      header: "Order ID",
      key: "id",
      width: 10,
    },
    { header: "Food", key: "food", width: 20 },
    { header: "Drink", key: "drink", width: 20 },
  ];

  worksheet.addRows(data);

  await workbook.xlsx.writeFile("example.xlsx");
}

module.exports = { writeDataToExecel };
