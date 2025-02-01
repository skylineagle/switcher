/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let settings = app.settings();

  // for all available settings fields you could check
  // /jsvm/interfaces/core.Settings.html
  settings.meta.appName = "Switcher";
  // settings.meta.appURL = "https://switcher.io";
  settings.logs.maxDays = 2;
  // settings.logs.logAuthId = true;
  // settings.logs.logIP = false;

  app.save(settings);
});
