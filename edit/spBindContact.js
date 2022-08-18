var template = '<div class="col-md-3">'+
				'<div class="contact-card">'+
				'<div class="cnt-round-img">'+
					'<span><img src="../../Shared Documents/People/ReplaceImagePath"/></span>'+
				'</div>'+
				'<h3><i class="fa fa-user" aria-hidden="true"></i>ReplaceName</h3>'+
				'<p><i class="fa fa-map-marker" aria-hidden="true"></i>ReplaceLocation</p>'+
				'<p><i class="fa fa-briefcase" aria-hidden="true"></i>ReplaceDesignation</p>'+
				'<div class="cnt-bottom">'+
					'<p><i class="fa fa-envelope" aria-hidden="true"></i><a style="cursor:pointer" href = "mailto: ReplaceEmail">ReplaceEmail</a></p>'+
					'<p><i class="fa fa-phone" aria-hidden="true"></i>ReplaceWorkPhone</p>'+
				'</div>'+
			'</div>'+
		'</div>';
var emptyTemplate = '<div class="no-cnt-box">'+
		'<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'+
		'<p>Sorry, no contact found!</p>';
function removeLoader(){
		$( ".loader-fix" ).fadeOut(500, function() {
		// fadeOut complete. Remove the loading div
		$( ".loader-fix" ).remove(); //makes page more lightweight 
	});  
}
$("#departmentData").change(function(){
	var searchText = $("#departmentData").val();
	searchByDepartment(searchText);
});
$("#searchtxt").keyup(function(){
	var searchText = $("#searchtxt").val();
	searchByName(searchText);
});

function searchByName(searchText){
	
	if(searchText == ""){
		replaceTxt(resultSet);
	}
	if(searchText.length >=3){
		var result = _.filter(resultSet,function(item){
			return item.Name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
		});
		replaceTxt(result);
	}
}

function searchByDepartment(searchText){
	
	if(searchText == "0"){
		replaceTxt(resultSet);
	}
	if(searchText.length >=3){
		var result = _.filter(resultSet,function(item){
			return item.Department.toLowerCase() == searchText.toLowerCase();
		});
		replaceTxt(result);
	}
}

function replaceTxt(data){
	if(data.length == 0){
		$("#bindRecord").html(emptyTemplate);
		return;
	}
	$("#bindRecord").html("");
	_.each(data,function(item){
		var imagePath= item.Name != "-" ? item.Name.replaceAll(" ","")+".jpg" : "img/round-img.png";
		var generateCode = template.replaceAll("ReplaceName",item.Name);
		generateCode = generateCode.replaceAll("ReplaceDesignation",item.Desgination);
		generateCode = generateCode.replaceAll("ReplaceEmail",item.Email);
		generateCode = generateCode.replaceAll("ReplaceDepartment",item.Department);
		generateCode = generateCode.replaceAll("ReplaceWorkPhone",item.WorkPhone);
		generateCode = generateCode.replaceAll("ReplaceLocation",item.Location);
		generateCode = generateCode.replaceAll("ReplaceImagePath",imagePath);
		$("#bindRecord").append(generateCode);
	});
}
var resultSet = [];

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://ishareteam4.na.xom.com/sites/PO%20Portal_Test/_api/web/lists/GetByTitle('POContacts')/items",
        cache: false,
        dataType: "xml",
        success: function(xml) {
			removeLoader();
            $(xml).find('entry content m\\:properties').each(function(){
				var conName = $(this).find("d\\:Full_x0020_Names").text() == "" ? '-':$(this).find("d\\:Full_x0020_Names").text();
				var conDesgination =  $(this).find("d\\:JobTitle").text() == "" ? '-':$(this).find("d\\:JobTitle").text();
				var conEmailAddress =  $(this).find("d\\:Email").text() == "" ? '-':$(this).find("d\\:Email").text();
				var conDepartment =  $(this).find("d\\:Department").text() == "" ? '-':$(this).find("d\\:Department").text();
				var conWorkPhone= $(this).find("d\\:WorkPhone").text() == "" ? '-':$(this).find("d\\:WorkPhone").text();
				var conLocation= $(this).find("d\\:Location").text() == "" ? '-':$(this).find("d\\:Location").text();
				resultSet.push({
					"Name":conName,
					"Desgination":conDesgination,
					"Email":conEmailAddress,
					"Department":conDepartment,
					"WorkPhone":conWorkPhone,
					"Location":conLocation
				});
				
            });
			var groupData = _.groupBy(resultSet,"Department");
			_.each(groupData,function(key,value){
				$("#departmentData").append($("<option></option>").attr("value",value).text(value));
			});
			replaceTxt(resultSet);
        }
    });
});