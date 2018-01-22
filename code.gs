function pasteData() {
  //Add yesterday's case data to the Translation Database.
  //Runs automatically between 01:00 and 02:00 daily.
  
  //Fix yesterdays date and the date string use in the database
  var date = new Date()
  date.setDate(date.getDate() - 2);
  var date_string = (pad(date.getMonth()+1)).toString()+"-"+pad(date.getDate()).toString()+"-"+date.getFullYear().toString().slice(2)
  
  //Find the last database entry
  var database = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Case Database");
  var case_column = database.getRange("E:E").getValues();
  
  var found = false;
  var last_row = 0;
  while (!found && last_row < case_column.length) {
    if (case_column[last_row][0] == "") {
      found = true
    }
    else {
      last_row += 1;
    }
  }
  
  //Extract the data from the Translation Proofreading Sheet (Schedule)
  var yesterday_data = getData(date);
  for (var i = 0; i < yesterday_data.length; i++) {
    yesterday_data[i].splice(1, 1);
  }
  
  var num_rows = yesterday_data.length;
  
  var dates = []
  for (var i = 0; i < num_rows; i++) {
    dates.push([date_string]);
  }
  
  //Add the data to the Translation Database
  if (num_rows > 0) {
    database.getRange(last_row+1, 5, num_rows, 6).setValues(yesterday_data);
    database.getRange(last_row+1, 3, num_rows, 1).setValues(dates);
  }
  


}


function getData(date) {
  //Extracts the case data from the Translation Proofreading Sheet (schedule) for the specified date object.
  //Returns an array with the Case ID, Proofreader, Editor, Translator, Word Count (Source), and Word Count (Target).
  
  var months = {0: "JAN", 
                1: "FEB",
                2: "MAR",
                3: "APR",
                4: "MAY",
                5: "JUN",
                6: "JUL",
                7: "AUG",
                8: "SEP",
                9: "OCT",
                10: "NOV",
                11: "DEC"}
  
  //Get the date and month
  var month = months[date.getMonth()]
  var date_number = date.getDate();
  
  //Open the schedule spreadsheets for yesterday's month
  var schedule = SpreadsheetApp.openById("13QDsOkVGVPMsbqg0_Qyet8cg3y9ySzR3XV9IlDLmEBs").getSheetByName(month);
  
  //Add all the data from yesterdays month to the array "data"
  var data = [];
  var num_rows = schedule.getMaxRows();
  for (var i= 0; i < 7; i++) {
    data = data.concat(schedule.getRange(2, (7*i+2), num_rows, 7).getValues());
  }
  
  //Search for the index of the specified date
  var found_start = false;
  while (!found_start) {
    for (i = 0; i < data.length; i++) {
      if (data[i][0] == date_number) {
        var date_index = i;
        found_start = true;
      }
    }
  }
  
  //Search for the first nonempty row under yesterday's index date
  var found_end = false;
  var end_index = date_index;
  while (!found_end && end_index < data.length) {
    if (data[end_index][0] == "") {
      found_end = true;
    }
    else {
      end_index += 1;
    }
  }

  
  var date_data = data.slice(date_index + 1, end_index);
  return trimData(date_data);

}


function trimData(data) {
  //Removes the whitespace around a string for the entries in a 2D array.
  
  for (var i = 0; i < data.length; i++) {
    for (var j = 1; j < 4; j++) {
      data[i][j] = data[i][j].trim();
    }
  }
  return data
}

function pad(n){
  return n<10 ? '0'+n : n
}

function findDuplicates() {
  
}  

