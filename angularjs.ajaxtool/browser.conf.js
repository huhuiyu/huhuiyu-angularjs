const browser = '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" --profile-directory="Profile 4" http://127.0.0.1:30000';
var exec = require('child_process').exec;
exec(browser, function(error, std, err) {
  console.log(error, std, err);
});
