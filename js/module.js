
$(document).ready(function () {

  /********** variable declarations ***********/

  var selects = document.querySelectorAll("select.selectionVals");
  var editPopup = false, editSegment = null;
  var radBtn = document.querySelectorAll(".radBtn");
  var empty_sect = document.querySelector(".empty_sect");
  var sections = document.querySelector(".sections");
  var selectType = document.querySelectorAll("select.selectionType");

  /********** hiding modal **********/

  $("#hider").hide();
  $("#popup").hide();

  /********** refresh modal on startup so that it get rids of all data entered before (useful when user refreshes browser)**********/

  refreshModal();

  /********** show modal **********/

  $(".showpopup").click(function () {
    $('#hider').removeClass("hidden");
    $('#popup').removeClass("hidden");
    $("body").addClass("modal-open");
    $("#hider").fadeIn(300);
    $('#popup').fadeIn(300);
    document.querySelector(".main_content").scrollTop = 0;
    initializeTabs();
  });

  /********** close modal **********/

  $(".buttonClose").click(function(event) {
    if(bindSelections()){
      $("body").removeClass("modal-open");
      $("#hider").fadeOut(300);
      $('#popup').fadeOut(300);
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
    segment.innerHTML = '<div class="control_btns"><button type="button" name="button" class="control_btn_select"></button><button type="button" name="button" class="control_btn_edit"></button></div><div class="seg_wrapper"><h3 id="seg_name" class="col-xs-12"></h3><h2 class="col-xs-12">Basic</h2><p id="file_path" class="col-xs-12 col-sm-6"><span id="fp" class="glyphicon glyphicon-link"></span> File path: <span id="fp_value"></span></p><p id="location" class="col-xs-12 col-sm-6"><span id="loc" class="glyphicon glyphicon-map-marker"></span> Location: <span id="loc_value"></span></p><p id="device_typ" class="col-xs-12 col-sm-6"><span id="dt" class="glyphicon glyphicon-phone"></span> Device type: <span id="dt_value"></span></p><p id="device_os" class="col-xs-12 col-sm-6"><span id="do" class="glyphicon glyphicon-list-alt"></span> Device OS: <span id="do_value"></span></p><p id="device_brow" class="col-xs-12 col-sm-6"><span id="db" class="glyphicon glyphicon-globe"></span> Browser: <span id="db_value"></span></p><p id="visit_day" class="col-xs-12 col-sm-6"><span id="vd" class="glyphicon glyphicon-calendar"></span> Visit day: <span id="vd_value"></span></p><p id="visitor_type" class="col-xs-12 col-sm-6"><span id="vt" class="glyphicon glyphicon-user"></span> Visitor type: <span id="vt_value"></span></p><h2 class="col-xs-12">Advanced</h2><p class="col-xs-12 conditionsHolder"></p><p class="col-xs-12 emptyCondDisplay hidden">AND/OR condtions between different segments have not been set.</p></div>';
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

  /********** binding modal with segment. Segment editing control button settings **********/

  function bindEditEvent(btn) {
    btn.addEventListener('click', function(event) {
      var locationst, devicest, osst, browserst, visitDayst, location, device, os, browser, visitDay, visitorType;
      var segment = event.target.parentNode.parentNode.querySelector(".seg_wrapper");
      var name = segment.childNodes[0].textContent;
      var filePath = segment.childNodes[2].textContent.substring(12);
      var condString = segment.childNodes[10].textContent;
      var conditionSels = condString.match(/'(\w+):/gi);
      var conditionVals = segment.querySelectorAll(".conditionsHolder > span");
      if (segment.childNodes[3].textContent.substring(11, 17) === "except")
        locationst = true;
      location = locationst ? segment.childNodes[3].textContent.substring(18).split(", ") : segment.childNodes[3].textContent.substring(11).split(", ");
      if (segment.childNodes[4].textContent.substring(14, 20) === "except")
        devicest = true;
      device = devicest ? segment.childNodes[4].textContent.substring(21).split(", ") : segment.childNodes[4].textContent.substring(14).split(", ");
      if (segment.childNodes[5].textContent.substring(12, 18) === "except")
        osst = true;
      os = osst ? segment.childNodes[5].textContent.substring(19).split(", ") : segment.childNodes[5].textContent.substring(12).split(", ");
      if (segment.childNodes[6].textContent.substring(10, 16) === "except")
        browserst = true;
      browser = browserst ? segment.childNodes[6].textContent.substring(17).split(", ") : segment.childNodes[6].textContent.substring(10).split(", ");
      if (segment.childNodes[7].textContent.substring(12, 18) === "except")
        visitDayst = true;
      visitDay = visitDayst ? segment.childNodes[7].textContent.substring(19).split(", ") : segment.childNodes[7].textContent.substring(12).split(", ");
      visitorType = segment.childNodes[8].textContent.substring(15);
      if(visitDayst)
        document.querySelector(".visitDaySelectionType").options[1].selected = true;
      if(locationst)
        document.querySelector(".countriesSelectionType").options[1].selected = true;
      if(devicest)
        document.querySelector(".deviceSelectionType").options[1].selected = true;
      if(browserst)
        document.querySelector(".browserSelectionType").options[1].selected = true;
      if(osst)
        document.querySelector(".osSelectionType").options[1].selected = true;

      document.querySelector(".seg_name").value = name;
      document.querySelector(".file_path").value = filePath;
      bindEditHelper(".countries", location);
      bindEditHelper(".device", device);
      bindEditHelper(".device_os", os);
      bindEditHelper(".device_browser", browser);
      bindEditHelper(".visit_day", visitDay);
      remActRad();
      document.querySelector("#"+visitorType).className = "radBtn active_rad";

      if(conditionSels)
        setAdvancedTab(conditionSels, conditionVals);

      $(".showpopup").click();
      editPopup = true;
      editSegment = segment;
      activateSelectedChoices();
    });
  }

  function activateSelectedChoices() {
    Array.prototype.forEach.call(document.querySelectorAll(".selectedChoices"), function(node) {
      node.className = "selectedChoices col-xs-12";
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

  function setAdvancedTab(selectionNames, conditionValues) {
    for(var i = 0; i < conditionValues.length; i++) {
      var elem = document.querySelector(".conditionModule").cloneNode(true);
      elem.querySelector(".conditionSelected").textContent = conditionValues[i].textContent;
      elem.querySelector(".conditionSelected").className = "conditionSelected " + (conditionValues[i].textContent.toLowerCase() === "or" ? "orselection" : "andselection" );
      bindConditionSelection(elem);
      document.querySelector(".conditionsWrapper").appendChild(elem);
    }

    // setting selection in advancedTab
    for(var i = 0 ; i < selectionNames.length; i++) {
      var selectElem = document.querySelectorAll(".segmentCondition");
      Array.prototype.forEach.call(selectElem[i].options, function(opt) {

        if(opt.value === selectionNames[i].substring(1, selectionNames[i].length-1)) {
          opt.selected = true;

        }
      });
    }
    disableAndBtns();
  }

  function disableAndBtns() {
    var cmods = document.querySelectorAll(".conditionModule");
    for(var i = 0; i < cmods.length-1; i++) {
      if(cmods[i+1].querySelector(".conditionSelected").textContent === "OR")
        cmods[i].querySelector(".andCondition").className = "andCondition conditions actCondition";
    }

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
    if(document.querySelectorAll(".segment_sect").length === 0) {
      empty_sect.className = "empty_sect";
      $(".empty_sect").fadeIn(200);
    }
  }

  /********** add segment settings **********/

  function addSegment(segment) {
    var section = segment;
    bindSelectEvent(section.querySelector(".control_btn_select"));
    bindEditEvent(section.querySelector(".control_btn_edit"));
    sections.insertBefore(section, sections.querySelector(".m_wrapper section"));
    $(".empty_sect").fadeOut(200);
    empty_sect.className = "empty_sect hidden"
  }

  /********** binding modal selections with segments **********/

  function bindSelections() {
    var segment = editPopup ? editSegment : getSegment();
    var name = document.querySelector(".seg_name").value || "";
    var filePath = document.querySelector(".file_path").value || "";
    var location = getButtonsText(document.querySelector(".countries_selected.selected_opt_area").childNodes);
    var device = getButtonsText(document.querySelector(".device_selected.selected_opt_area").childNodes);
    var os = getButtonsText(document.querySelector(".device_os_selected.selected_opt_area").childNodes);
    var browser = getButtonsText(document.querySelector(".device_browser_selected.selected_opt_area").childNodes);
    var visitDay = getButtonsText(document.querySelector(".visit_day_selected.selected_opt_area").childNodes);
    var visitorType = document.querySelector(".active_rad").getAttribute("data-val");

    if(name === "" || filePath === ""){
      showWarning("Fields of the basic info are required.");
      return false;
    }
    else {
      if(checkSelectionType(document.querySelector(".countriesSelectionType"))) {
        if(location === 'All') {
          showWarning("All countries can't be excluded.");
          return false;
        }
        location = location ? ("except " + location) : "";
        if(!location) document.querySelector(".countriesSelectionType").options[0].selected = true;
      }
      if(checkSelectionType(document.querySelector(".deviceSelectionType"))) {
        if(device === 'All') {
          showWarning("All devices can't be excluded.");
          return false;
        }
        device =  device ? ("except " + device) : "";
        if(!device) document.querySelector(".deviceSelectionType").options[0].selected = true;
      }
      if(checkSelectionType(document.querySelector(".osSelectionType"))) {
        if(os === 'All') {
          showWarning("All OSs can't be excluded.");
          return false;
        }
        os =  device ? ("except " + os) : "";
        if(!os) document.querySelector(".osSelectionType").options[0].selected = true;
      }
      if(checkSelectionType(document.querySelector(".browserSelectionType"))) {
        if(browser === 'All') {
          showWarning("All browsers can't be excluded.");
          return false;
        }
        browser = browser ? ("except " + browser) : "";
        if(!browser) document.querySelector(".browserSelectionType").options[0].selected = true;
      }
      if(checkSelectionType(document.querySelector(".visitDaySelectionType"))) {
        if(visitDay === 'Anyday') {
          showWarning("All days can't be excluded.");
          return false;
        }
        visitDay = visitDay ? ("except " + visitDay) : "";
        if(!visitDay) document.querySelector(".visitDaySelectionType").options[0].selected = true;
      }
      location = location || "All";
      device = device || "All";
      browser = browser || "All";
      os = os || "All";
      visitDay = visitDay || "Anyday";

      var conditionString = "[";
      deleteEmptyModules();
      var conditions = document.querySelectorAll(".conditionSelected");
      var segNames = document.querySelectorAll(".segmentCondition");
      for(var i = 0; i < segNames.length-1; i++) {
        conditionString +=  "'"+segInfo(segNames[i])+"'" + (conditions[i+1].textContent === 'AND' ? ']' : "") + " <span>" + conditions[i+1].textContent + "</span> " + (conditions[i+1].textContent === 'AND' ? '[' : "");

      }
      conditionString += "'" + segInfo(segNames[i]) + "']";
      function segInfo(elem) {
        var selectedItem = elem.options[elem.selectedIndex].text;
        switch (selectedItem) {
          case "Country":
            return "Country: " + location;
            break;
          case "Browser":
            return "Browser: " + browser;
            break;
          case "Device OS":
            return "Device_OS: " + os;
            break;
          case "Device type":
            return "Device_type: " + device;
            break;
          case "Visit day":
            return "Visit_day: " + visitDay;
            break;
          case "Visitor type":
            return "Visitor_type: " + visitorType;
            break;
          default:
            console.log("problem in switch");
        }
      }
      segment.querySelector("#seg_name").textContent = name;
      segment.querySelector("#fp_value").textContent = filePath;
      segment.querySelector("#loc_value").textContent = location;
      segment.querySelector("#dt_value").textContent = device;
      segment.querySelector("#do_value").textContent = os;
      segment.querySelector("#db_value").textContent = browser;
      segment.querySelector("#vd_value").textContent = visitDay;
      segment.querySelector("#vt_value").textContent = visitorType;
      segment.querySelector(".conditionsHolder").innerHTML = conditionString;
      if(conditionString === "['undefined']") {
        segment.querySelector(".emptyCondDisplay").className = "col-xs-12 emptyCondDisplay";
        segment.querySelector(".conditionsHolder").className = "col-xs-12 conditionsHolder hidden";
      }
      else  {
        segment.querySelector(".conditionsHolder").className = "col-xs-12 conditionsHolder";
        segment.querySelector(".emptyCondDisplay").className = "col-xs-12 emptyCondDisplay hidden";
      }

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
    for(var i = 0; i < btns.length-1; i++) {
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
      if(btns[i].nodeName === "BUTTON") {
        if(btns[i].textContent === "All" || btns[i].textContent === "Anyday")
          string = btns[i].textContent;
        else {
          string += btns[i].textContent;
        }
      }
    }
    return string;
  }

  function checkSelectionType(elem) {
    return elem.options[1].selected;
  }

  function deleteEmptyModules() {
    var mods = document.querySelectorAll(".conditionModule");
    Array.prototype.forEach.call(mods, function(condSelect) {
      var val = condSelect.querySelector(".segmentCondition").options[condSelect.querySelector(".segmentCondition").selectedIndex].value;
      if(val === "Select")
        condSelect.querySelector(".removeCondition").click();
    });
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
    primaryTabCondition();
    moveRightBasicTab();
    resetAdvancedTab();
    document.querySelector(".selectedChoices").className = "selectedChoices col-xs-12 hidden";
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

  function resetConditions(module) {
    var andBtns, orBtns, conditionDisplayer;
    if(module) {
      andBtns = module.querySelector(".andCondition");
      orBtns = module.querySelector(".orCondition");
      conditionDisplayer = module.querySelector(".conditionSelected");
      andBtns.className = "conditions andCondition";
      orBtns.className = "conditions orCondition";
      conditionDisplayer.textContent = "";
      conditionDisplayer.className = "conditionSelected";
    }
    else {
      andBtns = document.querySelectorAll(".andCondition");
      orBtns = document.querySelectorAll(".orCondition");
      conditionDisplayer = document.querySelectorAll(".conditionSelected");

      Array.prototype.forEach.call(andBtns, function(btn) {
        btn.className = "conditions andCondition";
      });
      Array.prototype.forEach.call(orBtns, function(btn) {
        btn.className = "conditions orCondition";
      });
      Array.prototype.forEach.call(conditionDisplayer, function(conditionDisplay) {
        conditionDisplay.textContent = "";
        conditionDisplay.className = "conditionSelected";
      });

    }
  }

  /************* tab btns setting *************/

  $(".basicTabBtn").click(function(event) {
    if ( $(".basicTabBtn").hasClass("deactiveTab") ) {
      primaryTabCondition();
      moveRightBasicTab();
    }
  });

  $(".advancedTabBtn").click(function(event) {
    if ( $(".advancedTabBtn").hasClass("deactiveTab") ) {
      $(".basicTabBtn").addClass("deactiveTab");
      $(".advancedTabBtn").removeClass("deactiveTab");
      conditionSelectedSetup();
      moveLeftBasicTab();
    }
  });

  function primaryTabCondition() {
    $(".basicTabBtn").removeClass("deactiveTab");
    $(".advancedTabBtn").addClass("deactiveTab");
  }

  function initializeTabs() {
    var val = $(".basicTab").width() + "px";
    $(".advancedTab").css('left', val);
  }

  function moveLeftBasicTab() {
    $(".advancedTab").removeClass('hidden');
    var val = "-" + Number($(".basicTab").width()+10) + "px";
    $(".main_content").css("overflow-y", "hidden");
    $(".basicTab").animate({left:val}, {duration: 200, easing: "linear", queue: false});
    $(".advancedTab").animate({left:"0"}, {duration: 200, easing: "linear", queue: false});
    setTimeout( function() {
       $(".basicTab").addClass("hidden");
    }, 300);
  }

  function moveRightBasicTab() {
    $(".basicTab").removeClass('hidden');
    var val = $(".basicTab").width() + "px";
    $(".basicTab").animate({left:"0"}, {duration: 200, easing: "linear", queue: false});
    $(".advancedTab").animate({left:val}, {duration: 200, easing: "linear", queue: false});
    $(".main_content").css("overflow-y", "auto");
    setTimeout( function() {
       $(".advancedTab").addClass("hidden");
    }, 300);
  }

  /**********change condition function for AND/OR condions while selecting segments**********/

  function bindConditionSelection(newMod) {
    var removeConditionBtns, conditionBtns;

    if(newMod) {
      removeConditionBtns = newMod.querySelectorAll(".removeCondition");
      conditionBtns = newMod.querySelectorAll(".conditions");
    }

    else {
      removeConditionBtns = document.querySelectorAll(".removeCondition");
      conditionBtns = document.querySelectorAll(".conditions");
    }

    Array.prototype.forEach.call(conditionBtns, function(actCond) {
      actCond.addEventListener("click", function(event) {
          if(!actCond.className.match(/\bactCondition\b/)) {
            addConditionModule(this);
            changeCondition(this.parentNode.parentNode, this.textContent);
          }
      });
    });

    Array.prototype.forEach.call(removeConditionBtns, function(btn) {
      btn.addEventListener("click", function(event) {
        removeConditionModule(this);
      });
    });

  }

  function changeCondition(elem, val) {
    if(val === "OR"){
      elem.nextSibling.querySelector(".conditionSelected").className = "conditionSelected orselection";
      elem.querySelector(".andCondition").className = "conditions andCondition actCondition";
      elem.nextSibling.querySelector(".conditionSelected").textContent = val;
      return true;
    }
    else{
      elem.nextSibling.querySelector(".conditionSelected").className = "conditionSelected andselection";
      elem.nextSibling.querySelector(".conditionSelected").textContent = val;
      return false;
    }
  }

  bindConditionSelection();

  /*************** addConditionModule *******************/

  function addConditionModule(that) {
    if(that.parentNode.parentNode.nextSibling) {
      that.parentNode.parentNode.parentNode.insertBefore(getConditionModule(that.parentNode.parentNode), that.parentNode.parentNode.nextSibling);
      bindConditionSelection(that.parentNode.parentNode.nextSibling);
      if( document.querySelectorAll(".conditionModule")[document.querySelectorAll(".conditionModule").length - 1] === that.parentNode.parentNode.nextSibling) {
        resetConditions(that.parentNode.parentNode.nextSibling);
        resetSelectedChoices(that.parentNode.parentNode.nextSibling);
      }

    }
    else {
      that.parentNode.parentNode.parentNode.appendChild(getConditionModule(that.parentNode.parentNode));
      bindConditionSelection(that.parentNode.parentNode.parentNode.lastChild);
      resetConditions(that.parentNode.parentNode.parentNode.lastChild);
      resetSelectedChoices(that.parentNode.parentNode.parentNode.lastChild);
    }
  }

  /*************** getConditionModule ********************/

  function getConditionModule(that) {
     var module = that.cloneNode(true);
     module.querySelector(".selectedChoices").className = "selectedChoices col-xs-12 hidden";
     bindSegmentConditionSelect(module.querySelector(".segmentCondition"));
     return module;
  }

  /*************** cloneConditionModule *******************/

  function cloneConditionModule() {
    conditionModule = document.querySelector(".conditionModule").cloneNode(true);
  }

  /***************** remove condition module *****************/

  function removeConditionModule(btn) {

    if(btn.parentNode.parentNode.previousSibling && btn.parentNode.parentNode.previousSibling.nodeName === "DIV") {

      if(btn.parentNode.parentNode.previousSibling.querySelector(".conditionSelected").textContent === "OR")
        btn.parentNode.parentNode.previousSibling.querySelector(".andCondition").className = "condtions andCondition";

    }

    if(btn.parentNode.parentNode.nextSibling && btn.parentNode.parentNode.nextSibling.nodeName === "DIV") {

      if(btn.parentNode.parentNode.nextSibling.querySelector(".conditionSelected").textContent === "OR" && btn.parentNode.parentNode.querySelector(".conditionSelected").textContent === "AND") {
        btn.parentNode.parentNode.nextSibling.querySelector(".orCondition").className = "condtions orCondition";
        btn.parentNode.parentNode.nextSibling.querySelector(".andCondition").className = "condtions andCondition";
        btn.parentNode.parentNode.nextSibling.querySelector(".conditionSelected").textContent = "AND";
        btn.parentNode.parentNode.nextSibling.querySelector(".conditionSelected").className = "conditionSelected andselection";
      }

    }

    if(btn.parentNode.parentNode.previousSibling && btn.parentNode.parentNode.nextSibling) {
      if(btn.parentNode.parentNode.previousSibling.nodeName === "DIV" && btn.parentNode.parentNode.nextSibling.nodeName === "DIV") {
        if(btn.parentNode.parentNode.previousSibling === btn.parentNode.parentNode.parentNode.querySelector(".conditionModule") ) {

           btn.parentNode.parentNode.previousSibling.querySelector(".andCondition").className = "conditions andCondition" ;
         }
        if(btn.parentNode.parentNode.previousSibling.querySelector(".conditionSelected").textContent === "OR" && btn.parentNode.parentNode.nextSibling.querySelector(".conditionSelected").textContent === "AND") {
          btn.parentNode.parentNode.previousSibling.querySelector(".conditionSelected").className = "conditionSelected orselection";
        }
        if(btn.parentNode.parentNode.previousSibling.querySelector(".conditionSelected").textContent === "AND" && btn.parentNode.parentNode.nextSibling.querySelector(".conditionSelected").textContent === "AND") {
          btn.parentNode.parentNode.previousSibling.querySelector(".andCondition").className = "conditions andCondition";
        }
      }
    }

    if(document.querySelectorAll(".conditionModule").length === 1){
      document.querySelector(".segmentCondition").options[0].selected = true;
      document.querySelector(".selectedChoices").className = "selectedChoices col-xs-12 hidden";
      document.querySelector(".selectedChoices > p").textContent = "";
    }

    if(document.querySelectorAll(".conditionModule").length > 1)
      btn.parentNode.parentNode.parentNode.removeChild(btn.parentNode.parentNode);

    if(document.querySelectorAll(".conditionModule").length === 1){
      document.querySelector(".andCondition").className = "conditions andCondition";
    }

    if(document.querySelectorAll(".conditionModule")[document.querySelectorAll(".conditionModule").length-1].querySelector(".andCondition").className.match(/\bactCondition\b/)) {

      document.querySelectorAll(".conditionModule")[document.querySelectorAll(".conditionModule").length-1].querySelector(".andCondition").className = "conditions andCondition";
    }

    disableAndBtns();
  }

  function resetAdvancedTab() {
    var cmList = document.querySelectorAll(".conditionModule");
    for(var i = 1; i < cmList.length; i++ ) {
      document.querySelector(".conditionsWrapper").removeChild(cmList[i]);
    }
    cmList[0].querySelector(".segmentCondition").options[0].selected = true;
  }

  function resetSelectedChoices(elem) {
    elem.querySelector(".selectedChoices > p").textContent = "";
  }

  /****************** shows selected choices for a particular segment in advanced tab **************************/

  function bindSegmentConditionSelect(select) {
    select.addEventListener("change", function() {
      var selected = this.options[this.selectedIndex].text;
      showSelectedChoices(this);
      this.parentNode.parentNode.querySelector(".selectedChoices > p").textContent = getSelections(selected);
    });
  }

  function showSelectedChoices(that) {
    that.parentNode.parentNode.querySelector(".selectedChoices").className = "selectedChoices col-xs-12";
    that.parentNode.parentNode.querySelector(".selectedChoices").style.marginTop = "15px";
  }

  function getSelections(text) {
    switch (text) {
      case 'Country':
      var location = getButtonsText(document.querySelector(".countries_selected.selected_opt_area").childNodes);
      if(checkSelectionType(document.querySelector(".countriesSelectionType"))) {
        location = location ? ("except " + location) : "";
      }
      location = location ? location : "nothing selected!";
      return "Country:  " + location;
      break;

      case 'Device type':
      var device = getButtonsText(document.querySelector(".device_selected.selected_opt_area").childNodes);
      if(checkSelectionType(document.querySelector(".deviceSelectionType"))) {
        device =  device ? ("except " + device) : "";
      }
      device = device ? device : "nothing selected!";
      return "Device type:  " + device;
      break;

      case 'Device OS':
      var os = getButtonsText(document.querySelector(".device_os_selected.selected_opt_area").childNodes);
      if(checkSelectionType(document.querySelector(".osSelectionType"))) {
        os =  os ? ("except " + os) : "";
      }
      os = os ? os : "nothing selected!";
      return "Device OS:  " + os;
      break;

      case 'Browser':
      var browser = getButtonsText(document.querySelector(".device_browser_selected.selected_opt_area").childNodes);
      if(checkSelectionType(document.querySelector(".browserSelectionType"))) {
        browser = browser ? ("except " + browser) : "";
      }
      browser = browser ? browser : "nothing selected!";
      return "Browser:  " + browser;
      break;

      case 'Visit day':
      var visitDay = getButtonsText(document.querySelector(".visit_day_selected.selected_opt_area").childNodes);
      if(checkSelectionType(document.querySelector(".visitDaySelectionType"))) {
        visitDay = visitDay ? ("except " + visitDay) : "";
      }
      visitDay = visitDay ? visitDay : "nothing selected!";
      return "Visit day:  " + visitDay;
      break;

      case 'Visitor type':
      var visitorType = document.querySelector(".active_rad").getAttribute("data-val");
      return "Visitor type:  " + visitorType;
      break;

      default:
      console.log("default case exec. while updating selection in advancedTab");
    }
  }

  function conditionSelectedSetup() {
    var selectElems = document.querySelectorAll(".segmentCondition");
    Array.prototype.forEach.call(selectElems, function(elem) {
      elem.parentNode.parentNode.querySelector('.selectedChoices > p').textContent = getSelections(elem.options[elem.selectedIndex].text);
    });
  }

  bindSegmentConditionSelect(document.querySelector(".segmentCondition"));

  /**********************************************************/

  document.querySelector(".removeSegment").disabled = false;
  document.querySelector(".rem_segment").disabled = false;

  /******************segment grouping/combination setup****************/

  var combBtn = document.querySelectorAll(".combineSegment");
  Array.prototype.forEach.call(combBtn, function(btn) {
    btn.addEventListener("click", function(){
      var segments = document.querySelectorAll(".selected_seg");
      if(segments.length > 1){
        showModalForComb();
      }
    });
  });

  function showModalForComb() {

    addCombinedSegment(segments);
  }

  function addCombinedSegment(selections) {

    var section = document.createElement("section");
    section.className = "segment_sect";

    var control_btns_div = document.createElement('div');
    control_btns_div.className = "control_btns";
    var selectBtn = document.createElement("button");
    selectBtn.className = "control_btn_select";
    var editBtn = document.createElement("button");
    editBtn.className = "control_btn_edit";
    control_btns_div.appendChild(selectBtn);
    control_btns_div.appendChild(editBtn);
    section.appendChild(control_btns_div);

    var seg_wrapper_div = document.createElement("div");
    seg_wrapper_div.className = "seg_wrapper";
    var seg_name_heading = document.createElement("h3");
    seg_name_heading.id = "seg_name";
    seg_name_heading.className = "col-xs-12";
    var heading = document.createElement("h2");
    heading.className = "col-xs-12";
    heading.textContent = "Conditions"
    seg_wrapper_div.appendChild(seg_name_heading);
    seg_wrapper_div.appendChild(heading);

    // set for loop here
    var condition = document.createElement("p");
    condition.className = "col-xs-12 conditionsHolder";
    seg_wrapper_div.appendChild(condition);
    //loop ends here

    section.appendChild(seg_wrapper_div);
    addSegment(section);
  }

});
