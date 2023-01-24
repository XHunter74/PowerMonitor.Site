var package = require("./package.json");
var buildVersion = package.version;
try {
    console.log(buildVersion);
}
catch (error) {
    console.error('Error occurred:', error);
    throw error
}
