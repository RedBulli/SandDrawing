$(document).ready(function() {
  var canvas = document.getElementById('sandbox');
  var sandbox = new Sandbox(canvas);
  sandbox.initialize();
  TouchUI.init(sandbox);
});
