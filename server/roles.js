const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("student")
    .readOwn("profile")
    .updateOwn("profile");

  ac.grant("teacher")
    .extend("student")
    .readAny("profile")
    .updateAny("profile");

  ac.grant("admin")
    .extend("student")
    .extend("teacher")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
