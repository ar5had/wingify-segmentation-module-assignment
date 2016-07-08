
$(document).ready(function () {

  $("#hider").hide();
  $("#popup").hide();

  $(".showpopup").click(function () {
    $('#hider').removeClass("hidden");
    $('#popup').removeClass("hidden");
    $("body").addClass("modal-open");
    $("#hider").fadeIn(400);
    $('#popup').fadeIn(400);
  });

  $(".buttonClose").click(function () {
    if(bindSelections()){
      $("body").removeClass("modal-open");
      $("#hider").fadeOut(400);
      $('#popup').fadeOut(400);
      setTimeout(function(){
        refreshModal();
      }, 350);
    }
    else {
      $(".main_content").animate({scrollTop: 0}, 500);
    }
  });

  $(".buttonClosens").click(function () {
    $("body").removeClass("modal-open");
    $("#hider").fadeOut(400);
    $('#popup').fadeOut(400);
    setTimeout(function(){
      refreshModal();
    }, 350);
  });

/////// error msg popup button

  $("#ok_btn").click(function () {
    $('#msg_wrapper').fadeOut(200);
  });


/////////// Segment Construction
function getSegment() {
  var segment = document.createElement("section");
  segment.className = "segment_sect";
  segment.innerHTML = "<div class='control_btns'><button type='button' name='button' class='control_btn_select'></button><button type='button' name='button' class='control_btn_edit'><span class='glyphicon glyphicon-cog'></span></button></div><div class='seg_wrapper'><h3 id='seg_name' class='col-xs-12'></h3><p id='file_path' class='col-xs-12 col-sm-6'><span id='fp' class='glyphicon glyphicon-link'></span> File path: <span id='fp_value'></span></p><p id='location' class='col-xs-12 col-sm-6'><span id='loc' class='glyphicon glyphicon-map-marker'></span> Location: <span id='loc_value'></span></p><p id='device_typ' class='col-xs-12 col-sm-6'><span id='dt' class='glyphicon glyphicon-phone'></span> Device type: <span id='dt_value'></span></p><p id='device_os' class='col-xs-12 col-sm-6'><span id='do' class='glyphicon glyphicon-list-alt'></span> Device OS: <span id='do_value'></span></p><p id='device_brow' class='col-xs-12 col-sm-6'><span id='db' class='glyphicon glyphicon-globe'></span> Browser: <span id='db_value'></span></p><p id='visit_day' class='col-xs-12 col-sm-6'><span id='vd' class='glyphicon glyphicon-calendar'></span> Visit day: <span id='vd_value'></span></p><p id='visitor_type' class='col-xs-12 col-sm-6'><span id='vt' class='glyphicon glyphicon-user'></span> Visitor type: <span id='vt_value'></span></p></div>";
  return segment;
}

////////// Modal Radio buttons

  var radBtn = document.querySelectorAll(".radBtn");

  function remActRad() {
    var act_rad = document.querySelector(".active_rad") || "";
    if(act_rad) {
      act_rad.className = "";
      act_rad.className = "radBtn"
    }
    else {
      return;
    }
  }

  for (var i = 0; i < radBtn.length; i++){
    var btn = radBtn[i];
    btn.addEventListener('click', function() {
      remActRad();
      this.className += " active_rad"
    });
  }

/////////// Control button select

  var seg_select_btn = document.querySelectorAll(".control_btn_select") || "";
  for (var i = 0; i < seg_select_btn.length; i++){
    var btn = seg_select_btn[i];
    bindSelectEvent(btn);
  }

  function bindSelectEvent(btn) {
    btn.addEventListener('click', function() {
      if(this.parentNode.querySelector(".selected_seg")){
        this.className = "control_btn_select";
        this.parentNode.parentNode.className = "segment_sect";
      }
      else {
        this.className += " selected_seg";
        this.parentNode.parentNode.className += " seg_selected";
      }
    });
  }

////////// Modal Select Box
    var selects = document.querySelectorAll("select");

    Array.prototype.forEach.call(selects, function(select) {

      select.addEventListener("change", function() {
        var name = select.name;
        var options = select.options;
        for(var i = 0; i < options.length; i++) {
          if(options[i].selected) {
            var selected_btn = document.createElement("button");
            selected_btn.className = "selected_opt";
            var span = document.createElement('span');
            span.className = "glyphicon glyphicon-remove";
            selected_btn.textContent = options[i].value;
            selected_btn.appendChild(span);
            selected_btn.onclick = remove;
            var selected_area_class = "." + name + "_selected.selected_opt_area";
            var selected_opt_area = document.querySelector(selected_area_class);
            selected_opt_area.appendChild(selected_btn);
            options[i].disabled = true;
          }
        }
        options[0].selected = true;
      });

    });

  function remove() {
    var text = this.textContent;
    var select = this.parentNode.parentNode.querySelector("select");
    Array.prototype.forEach.call(select.options, function(opt) {
      if(opt.value === text)
        opt.disabled = false;
    });
    this.parentNode.removeChild(this);
  }

/////// remove segment button
  var empty_sect = document.querySelector(".empty_sect");
  $(".removeSegment").click(function(){
    removeSegment();
  });

  function removeSegment() {
    var targetSegments = document.querySelectorAll(".seg_selected");
    Array.prototype.forEach.call(targetSegments, function(seg) {
      seg.parentNode.removeChild(seg);
    });
    if(document.querySelectorAll(".segment_sect").length === 0)
      empty_sect.className = "empty_sect";
  }

//////// add segment button
  var sections = document.querySelector(".sections");
  function addSegment(segment) {
    var section = segment;
    bindSelectEvent(section.querySelector(".control_btn_select"));
    sections.appendChild(section);
    empty_sect.className = "empty_sect hidden"
  }

///////// bind modal selections with segments

  function bindSelections() {
    var segment = getSegment();
    var name = document.querySelector(".seg_name").value || "";
    var filePath = document.querySelector(".file_path").value || "";
    var location = getButtonsText(document.querySelector(".countries_selected.selected_opt_area").childNodes) || "All";
    var device = getButtonsText(document.querySelector(".device_selected.selected_opt_area").childNodes) || "All";
    var os = getButtonsText(document.querySelector(".device_os_selected.selected_opt_area").childNodes) || "All";
    var browser = getButtonsText(document.querySelector(".device_browser_selected.selected_opt_area").childNodes) || "All";
    var visitDay = getButtonsText(document.querySelector(".visit_day_selected.selected_opt_area").childNodes) || "Anyday";
    var visitorType = document.querySelector(".active_rad").getAttribute("data-val");
    if(name === "" || filePath === ""){
      $('#msg_wrapper').removeClass("hidden");
      $('#msg_wrapper').fadeIn(200);
      return false;
    }
      else {
      segment.querySelector("#seg_name").textContent = name;
      segment.querySelector("#fp_value").textContent = filePath;
      segment.querySelector("#loc_value").textContent = location;
      segment.querySelector("#dt_value").textContent = device;
      segment.querySelector("#do_value").textContent = os;
      segment.querySelector("#db_value").textContent = browser;
      segment.querySelector("#vd_value").textContent = visitDay;
      segment.querySelector("#vt_value").textContent = visitorType;
      addSegment(segment);
      return true;
    }
  }

  function getButtonsText(btns) {
    var string = "";
    for(var i = 0; i < btns.length - 1; i++) {
      if(btns[i].nodeName !== "BUTTON")
        continue;
      else {
        if(btns[i].textContent === "All" || btns[i].textContent === "Anyday") {
          string = btns[i].textContent;
          return string;
        }
        else {
          string += btns[i].textContent+", ";
        }
      }
    }

    if(btns[i]){
      if(btns[i].nodeName === "BUTTON")
        string += btns[i].textContent;
    }
    return string;
  }


//////// refresh Modal function

  function refreshModal() {
    document.querySelector(".main_content").scrollTop = 0;
    document.querySelector(".seg_name").value = "";
    document.querySelector(".file_path").value = "";
    removeAllChild(document.querySelector(".countries_selected.selected_opt_area"))
    removeAllChild(document.querySelector(".device_selected.selected_opt_area"));
    removeAllChild(document.querySelector(".device_os_selected.selected_opt_area"));
    removeAllChild(document.querySelector(".device_browser_selected.selected_opt_area"));
    removeAllChild(document.querySelector(".visit_day_selected.selected_opt_area"));
    removeSelectedOptions();
    remActRad();
    document.querySelector("#both_rad").className = "radBtn active_rad";
  }

  function removeAllChild(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function removeSelectedOptions() {
    var selects = document.querySelectorAll("select");
    Array.prototype.forEach.call(selects, function(select) {
      for(var i = 1; i < select.options.length; i++){
        if(select.options[i].disabled){
          select.options[i].disabled = false;
        }
      }
    });
  }

});
