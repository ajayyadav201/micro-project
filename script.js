


// Constants

var connToken = "90931450|-31949325301904315|90949635";
var projectDBName = "COLLEGE-DB"
var projectRelationName = "PROJECT-TABLE"

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml"
var jpdbIRL = "/api/irl";
var jpdbISL = "/api/isl";

function resetForm(){

    $("#projectid").prop("disabled", false)
    $("#projectname").prop("disabled", false);
    $("#assignedto").prop("disabled", false);
    $("#assignmentdate").prop("disabled", false);
    $("#deadline").prop("disabled", false);

    $("#projectid").val("")
    $("#projectname").val("");
    $("#assignedto").val("");
    $("#assignmentdate").val("");
    $("#deadline").val("");

    $("#projectname").prop("disabled", false);
    $("#assignedto").prop("disabled", true);
    $("#assignmentdate").prop("disabled", true);
    $("#deadline").prop("disabled", true);

    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", false);

    $("#projectid").focus();
}

function validateAndGetFormData() {
    var projectidVar = $("#projectid").val();
    if (projectidVar === "") {
           alert("Project-ID is Required Value");
           $("#projectid").focus();
           return "";
    }
    var projectnameVar = $("#projectname").val();
    if (projectnameVar === "") {
           alert("Project-Name is Required Value");
           $("#projectname").focus();
           return "";
    }
    var assignedtoVar = $("#assignedto").val();
    if (assignedtoVar === "") {
        alert("Assigned-To is Required Value");
        $("#assignedto").focus();
        return "";
    }
    var assignmentdateVar = $("#assignmentdate").val();
    if (assignmentdateVar === "") {
        alert("Assignment-Date is Required Value");
        $("#assignmentdate").focus();
        return "";
    }
    var deadlineVar = $("#deadline").val();
    if (deadlineVar === "") {
        alert("Deadline is Required Value");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
           projectid: projectidVar,
           projectname: projectnameVar,
           assignedto: assignedtoVar,
           assignmentdate: assignmentdateVar,
           deadline: deadlineVar,
    };

    return JSON.stringify(jsonStrObj);
}

function saveData(){
    var jsonStrObj = validateAndGetFormData();

    if(jsonStrObj === ""){
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, projectDBName, projectRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML)
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#projectid").focus();
}

function updateData(){
    $("#update").prop("disabled", true);
    jsonChg = validateAndGetFormData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, projectDBName, projectRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML)
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#projectid").focus();
}

function getProject(){
    var projectidJsonObj = getProjectidAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projectDBName, projectRelationName, projectidJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);

    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projectname").focus();
        $("#assignedto").prop("disabled", false);
        $("#assignmentdate").prop("disabled", false);
        $("#deadline").prop("disabled", false);
    }else if(resJsonObj.status === 200) {
        $("#projectid").prop("disabled", true);
        fillData(resJsonObj);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#projectname").focus();
        $("#assignedto").prop("disabled", false);
        $("#assignmentdate").prop("disabled", false);
        $("#deadline").prop("disabled", false);
    }

}

function getProjectidAsJsonObj(){
    var projectId = $("#projectid").val();
    var jsonStr = {
        projectid: projectId   
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#projectname").val(record.projectname);
    $("#assignedto").val(record.assignedto);
    $("#assignmentdate").val(record.assignmentdate);
    $("#deadline").val(record.deadline);
    console.log("Filled data into fields");
    
}

function saveRecNo2LS(jsonObj){

    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
    console.log("Saved record number to Local Storage");

}