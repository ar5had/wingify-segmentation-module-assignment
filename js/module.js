
$(document).ready(function () {

  /********** variable declarations ***********/

  var selects = document.querySelectorAll("select.selectionVals");
  var editPopup = false, editSegment = null;
  var radBtn = document.querySelectorAll(".radBtn");
  var empty_sect = document.querySelector(".empty_sect");
  var sections = document.querySelector(".sections");
  var selectType = document.querySelectorAll("select.selectionType");
  var conditionBtns = document.querySelectorAll(".conditions");
  /********** hiding modal **********/

  $("#hider").hide();
  $("#popup").hide();

  /********** show modal **********/

  $(".showpopup").click(function () {
    document.querySelector(".main_content").scrollTop = 0;
    $('#hider').removeClass("hidden");
    $('#popup').removeClass("hidden");
    $("body").addClass("modal-open");
    $("#hider").fadeIn(400);
    $('#popup').fadeIn(400);
  });

  /********** close modal **********/

  $(".buttonClose").click(function(event) {
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

  /********** close modal but dont save selections **********/

  $(".buttonClosens").click(function () {
    $("body").removeClass("modal-open");
    $("#hider").fadeOut(400);
    $('#popup').fadeOut(400);
    setTimeout(function(){
      refreshModal();
    }, 350);
  });

  /********** error message popup settings **********/

  $("#ok_btn").click(function () {
    $('#msg_wrapper').fadeOut(200);
  });

  /********** segment body construction **********/

  function getSegment() {
    var segment = document.createElement("section");
    segment.className = "segment_sect";
    segment.innerHTML = "<div class='control_btns'><button type='button' name='button' class='control_btn_select'></button><button type='button' name='button' class='control_btn_edit'></button></div><div class='seg_wrapper'><h3 id='seg_name' class='col-xs-12'></h3><p id='file_path' class='col-xs-12 col-sm-6'><span id='fp' class='glyphicon glyphicon-link'></span> File path: <span id='fp_value'></span></p><p id='location' class='col-xs-12 col-sm-6'><span id='loc' class='glyphicon glyphicon-map-marker'></span> Location: <span id='loc_value'></span></p><p id='device_typ' class='col-xs-12 col-sm-6'><span id='dt' class='glyphicon glyphicon-phone'></span> Device type: <span id='dt_value'></span></p><p id='device_os' class='col-xs-12 col-sm-6'><span id='do' class='glyphicon glyphicon-list-alt'></span> Device OS: <span id='do_value'></span></p><p id='device_brow' class='col-xs-12 col-sm-6'><span id='db' class='glyphicon glyphicon-globe'></span> Browser: <span id='db_value'></span></p><p id='visit_day' class='col-xs-12 col-sm-6'><span id='vd' class='glyphicon glyphicon-calendar'></span> Visit day: <span id='vd_value'></span></p><p id='visitor_type' class='col-xs-12 col-sm-6'><span id='vt' class='glyphicon glyphicon-user'></span> Visitor type: <span id='vt_value'></span></p></div>";
    return segment;
  }

  /********** modal radio buttons settings **********/

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

  /********** segment seclecting control button settings **********/

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

  /********** segment editing control button settings **********/

  function bindEditEvent(btn) {
    btn.addEventListener('click', function(event) {
      var segment = event.target.parentNode.parentNode.querySelector(".seg_wrapper");
      var name = segment.childNodes[0].textContent;
      var filePath = segment.childNodes[1].textContent.substring(12);
      var location = segment.childNodes[2].textContent.substring(11).split(", ");
      var device = segment.childNodes[3].textContent.substring(14).split(", ");
      var os = segment.childNodes[4].textContent.substring(12).split(", ");
      var browser = segment.childNodes[5].textContent.substring(10).split(", ");
      var visitDay = segment.childNodes[6].textContent.substring(12).split(", ");
      var visitorType = segment.childNodes[7].textContent.substring(15);
      document.querySelector(".seg_name").value = name;
      document.querySelector(".file_path").value = filePath;
      bindEditHelper(".countries", location);
      bindEditHelper(".device", device);
      bindEditHelper(".device_os", os);
      bindEditHelper(".device_browser", browser);
      bindEditHelper(".visit_day", visitDay);
      remActRad();
      document.querySelector("#"+visitorType).className = "radBtn active_rad";
      $(".showpopup").click();
      editPopup = true;
      editSegment = segment;
    });
  }

  function bindEditHelper(classes, btns) {
      var select = document.querySelector(classes);
      btns.forEach(function(btn) {
        Array.prototype.forEach.call(select.options, function(opt) {
          if(opt.value === btn){
            opt.disabled = true;
            var selected_btn = document.createElement("button");
            selected_btn.className = "selected_opt";
            var span = document.createElement('span');
            span.className = "glyphicon glyphicon-remove";
            selected_btn.textContent = btn;
            selected_btn.appendChild(span);
            selected_btn.onclick = remove;
            var selected_area_class = classes + "_selected.selected_opt_area";
            var selected_opt_area = document.querySelector(selected_area_class);
            selected_opt_area.appendChild(selected_btn);
          }
        });
      });
  }

  /********** modal select box settings **********/

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
    var select = this.parentNode.parentNode.querySelectorAll("select")[1];
    Array.prototype.forEach.call(select.options, function(opt) {
      if(opt.value === text)
        opt.disabled = false;
    });
    this.parentNode.removeChild(this);
  }

  /********** remove segment settings **********/

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

  /********** add segment settings **********/

  function addSegment(segment) {
    var section = segment;
    bindSelectEvent(section.querySelector(".control_btn_select"));
    bindEditEvent(section.querySelector(".control_btn_edit"));
    sections.appendChild(section);
    empty_sect.className = "empty_sect hidden"
  }

  /********** binding modal selections with segments **********/

  function bindSelections() {
    console.log("bindSelections Called");
    var segment = editPopup ? editSegment : getSegment();
    var name = document.querySelector(".seg_name").value || "";
    var filePath = document.querySelector(".file_path").value || "";
    var location = getButtonsText(document.querySelector(".countries_selected.selected_opt_area").childNodes) || "All";
    var device = getButtonsText(document.querySelector(".device_selected.selected_opt_area").childNodes) || "All";
    var os = getButtonsText(document.querySelector(".device_os_selected.selected_opt_area").childNodes) || "All";
    var browser = getButtonsText(document.querySelector(".device_browser_selected.selected_opt_area").childNodes) || "All";
    var visitDay = getButtonsText(document.querySelector(".visit_day_selected.selected_opt_area").childNodes) || "Anyday";
    var visitorType = document.querySelector(".active_rad").getAttribute("data-val");
    console.log(location, device, os, browser, visitDay);
    if(name === "" || filePath === ""){
      showWarning("Fields of the basic info are required.");
      return false;
    }
      else {
      if(checkSelectionType(document.querySelector(".countriesSelectionType"))) {
        if(location === 'All') {
          showWarning("Atleast one of the country should be selected.");
          return false;
        }
        location = "except " + location;
      }
      if(checkSelectionType(document.querySelector(".deviceSelectionType"))) {
        if(location === 'All') {
          showWarning("Atleast one of the device should be selected.");
          return false;
        }
        device = "except " + device;
      }
      if(checkSelectionType(document.querySelector(".osSelectionType"))) {
        if(location === 'All') {
          showWarning("Atleast one of the OS should be selected.");
          return false;
        }
        os = "except " + os;
      }
      if(checkSelectionType(document.querySelector(".browserSelectionType"))) {
        if(location === 'All') {
          showWarning("Atleast one of the browser should be selected.");
          return false;
        }
        browser = "except " + browser;
      }
      if(checkSelectionType(document.querySelector(".visitDaySelectionType"))) {
        if(location === 'Anyday') {
          showWarning("Atleast one of the day should be selected.");
          return false;
        }
        visitDay = "except " + visitDay;
      }
      segment.querySelector("#seg_name").textContent = name;
      segment.querySelector("#fp_value").textContent = filePath;
      segment.querySelector("#loc_value").textContent = location;
      segment.querySelector("#dt_value").textContent = device;
      segment.querySelector("#do_value").textContent = os;
      segment.querySelector("#db_value").textContent = browser;
      segment.querySelector("#vd_value").textContent = visitDay;
      segment.querySelector("#vt_value").textContent = visitorType;
      if(!editPopup)
        addSegment(segment);
      else{
        editPopup = false;
        editSegment = null;
      }
      return true;
    }
  }

  function showWarning(text) {
    if(text)
      document.querySelector("#error_msg").textContent = text;
    $('#msg_wrapper').removeClass("hidden");
    $('#msg_wrapper').fadeIn(200);
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

  function checkSelectionType(elem) {
    console.log(elem.options, elem.options[1].selected);
    return elem.options[1].selected;
  }

  /********** refresh modal function for clearing out selections**********/

  function refreshModal() {
    editPopup = false;
    editSegment = null;
    document.querySelector(".main_content").scrollTop = 0;
    document.querySelector(".seg_name").value = "";
    document.querySelector(".file_path").value = "";
    removeAllChild(document.querySelector(".countries_selected.selected_opt_area"))
    removeAllChild(document.querySelector(".device_selected.selected_opt_area"));
    removeAllChild(document.querySelector(".device_os_selected.selected_opt_area"));
    removeAllChild(document.querySelector(".device_browser_selected.selected_opt_area"));
    removeAllChild(document.querySelector(".visit_day_selected.selected_opt_area"));
    removeSelectedOptions();
    resetSelectTypes();
    resetConditions();
    remActRad();
    document.querySelector("#Both").className = "radBtn active_rad";
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

  function resetSelectTypes() {
    Array.prototype.forEach.call(selectType, function(select) {
      select.options[0].selected = true;
    });
  }

  function resetConditions() {
    Array.prototype.forEach.call(document.querySelectorAll(".andCondition"), function(btn) {
      btn.className = "conditions andCondition actCondition";
    });
    Array.prototype.forEach.call(document.querySelectorAll(".orCondition"), function(btn) {
      btn.className = "conditions orCondition";
    });
    Array.prototype.forEach.call(document.querySelectorAll(".conditionSelected"), function(conditionDisplay) {
      conditionDisplay.textContent = "AND";
      conditionDisplay.className = "conditionSelected";
    });
  }

  /**********change condition function for AND/OR condions while selecting segments**********/

  Array.prototype.forEach.call(conditionBtns, function(actCond) {
    actCond.addEventListener("click", function() {
      this.parentNode.querySelector(".actCondition").className = "conditions " + this.parentNode.querySelector(".actCondition").getAttribute("data-condition") + "Condition";
      this.className = "conditions " + this.getAttribute("data-condition") + "Condition actCondition";
      changeCondition(this.parentNode.parentNode.parentNode, this.textContent);
    });
  });

  function changeCondition(elem, val) {
    if(val === "OR")
      elem.querySelector(".conditionSelected").className = "conditionSelected orselection";
    else
      elem.querySelector(".conditionSelected").className = "conditionSelected";
    elem.querySelector(".conditionSelected").textContent = val;
  }

  document.querySelector(".removeSegment").disabled = false;
  document.querySelector(".rem_segment").disabled = false;

});
