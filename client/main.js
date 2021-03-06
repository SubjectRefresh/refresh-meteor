function updateSubjects() {
    var examBoardBuffer = document.getElementById("selectBoard");
    var examBoard = examBoardBuffer.options[examBoardBuffer.selectedIndex].value;
    $.post(examBoard).success(function(data) {
        $("#selectSubject").find("option").each(function() {
            $(this).remove();
        });
        for (i = 0; i < data.subjectData.length - 1; i++) {
            var i_n = data.subjectData[i].split("-");
            var rest = i_n.pop().toString();
            $("#selectSubject").append("<option value='" + rest.replace(/ /g, '') + "'>" + i_n.last() + "</option>");
            $("#remove_subject").remove();
        }
    }, "json").done(function() {
        console.log("Finished looking for syllabuses");
    });
}

function updateSyllabus(i_n) {
    console.log("the needed syllabus is " + i_n);
    var examBoardBuffer = document.getElementById("selectBoard");
    var examBoard = examBoardBuffer.options[examBoardBuffer.selectedIndex].value;
    $.post(examBoard + "Subject", {
        "syllabusNumber": i_n
    }).success(function(urls) {
        $("#selectSyllabus").find("option").each(function() {
            $(this).remove();
        });
        for (i = 0; i < urls.length - 1; i++) {
            console.log(urls[i]);
            $("#selectSyllabus").append("<option onclick='goGetSyllabus(" + i_n + ")' value='" + urls[i][0] + "'>" + urls[i][1] + "</option>");
            $("#remove_syllabus").remove();
        }
    }, "json").done(function() {
        console.log("Finished looking for subjects");
    });
}

function goGetSyllabus(i_n) {
    var examBoardBuffer = document.getElementById("selectBoard");
    var examBoard = examBoardBuffer.options[examBoardBuffer.selectedIndex].value;

    var subjectBuffer = document.getElementById("selectSubject");
    var subject = subjectBuffer.options[subjectBuffer.selectedIndex].value;

    var syllabusBuffer = document.getElementById("selectSyllabus");
    var syllabus = syllabusBuffer.options[syllabusBuffer.selectedIndex].value;

    if (examBoard == "CIE") {
        i_n = "http://cie.org.uk" + i_n;
        console.log(i_n);
    }
    var password = "(Abcde12345)";
    var email = "OliCallaghan@icloud.com"
    var examBoardBuffer = document.getElementById("selectBoard");
    var examBoard = examBoardBuffer.options[examBoardBuffer.selectedIndex].value;
    $.post("/dashboard", {
        "email": email,
        "password": password,
        "examBoard": examBoard,
        "subject": subject,
        "syllabus": syllabus,
        "url": i_n
    }).success(function(data) {
        $("html").html(data);
    });
    // Oli: i_n = the url for the PDF - do with it what you want.
}

$("#selectBoard").on("change", function() {
    updateSubjects();
});
$("#selectBoard").on("click", function() {
    updateSubjects();
});
$("#selectSubject").on("change", function() {
    updateSyllabus($("#selectSubject").find(":selected").attr("value"));
});
$("#selectSubject").on("click", function() {
    updateSyllabus($("#selectSubject").find(":selected").attr("value"));
});
$("#selectSyllabus").on("click", function() {
    goGetSyllabus($("#selectSyllabus").find(":selected").attr("value"));
});
$("#selectSyllabus").on("change", function() {
    goGetSyllabus($("#selectSyllabus").find(":selected").attr("value"));
});
// This code only runs on the client
console.log("Hey, client speaking!");