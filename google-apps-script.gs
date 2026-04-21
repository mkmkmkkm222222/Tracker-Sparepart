/**
 * Google Apps Script for SparePart Tracking System
 * 
 * Instructions:
 * 1. Open Google Sheets
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Create a sheet named "DataMovement" with headers:
 *    Timestamp | No SJ | Teknisi | Sparepart | No Seri | Koordinat | Status
 * 5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DataMovement");
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.no_sj,
      data.nama_teknisi,
      data.sparepart,
      data.no_seri,
      data.koordinat,
      data.status || "Proses"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DataMovement");
    var values = sheet.getDataRange().getValues();
    
    // Remove header row
    var headers = values.shift();
    
    var result = values.map(function(row, index) {
      return {
        id: index.toString(),
        timestamp: Utilities.formatDate(row[0], "GMT+7", "yyyy-MM-dd HH:mm"),
        no_sj: row[1],
        nama_teknisi: row[2],
        sparepart: row[3],
        no_seri: row[4],
        koordinat: row[5],
        status: row[6]
      };
    });
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
