function append_notebook(a){clear_main_area(),$("#main").append('<iframe frameBorder="0" seamless="seamless" style="width: 100%; height: 100%; overflow:hidden;" scrolling="no" src="'+a+'"></iframe>')}function clear_main_area(){$("#spinner").remove(),$("#main").children().remove()}function display_spinner(){$("#main").append('<img id="spinner" src="'+galaxy_root+'static/style/largespinner.gif" style="position:absolute;margin:auto;top:0;left:0;right:0;bottom:0;">')}function load_when_ready(a,b){var c=0,d=1e3,e=15e3,f=1e3,g=function(){$.ajax({url:a,xhrFields:{withCredentials:!0},type:"GET",timeout:500,dataType:"json",success:function(a){1==a?(console.log("Galaxy reports IE container ready, returning"),clear_main_area(),toastr.clear(),b()):0==a?(0==c&&(display_spinner(),toastr.info("Galaxy is launching a container in which to run this interactive environment. Please wait...",{closeButton:!0,tapToDismiss:!1})),c++,e>d&&(d+=f),console.log("Readiness request "+c+" sleeping "+d/1e3+"s"),window.setTimeout(g,d)):(clear_main_area(),toastr.clear(),toastr.error("Galaxy failed to launch a container in which to run this interactive environment, contact your administrator.","Error",{closeButton:!0,tapToDismiss:!1}))}})};window.setTimeout(g,d)}function test_ie_availability(a,b){var c=0;display_spinner(),interval=setInterval(function(){$.ajax({url:a,xhrFields:{withCredentials:!0},type:"GET",timeout:500,success:function(){console.log("Connected to IE, returning"),clearInterval(interval),b()},error:function(){c++,console.log("Availability request "+c),c>30&&(clearInterval(interval),clear_main_area(),toastr.error("Could not connect to IE, contact your administrator","Error",{closeButton:!0,timeOut:2e4,tapToDismiss:!1}))}})},1e3)}
//# sourceMappingURL=../maps/galaxy.interactive_environments.js.map