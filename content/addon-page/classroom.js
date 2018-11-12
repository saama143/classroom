googleAuth = new OAuth2('google', {
	client_id: '129098248537-2c1r65n16tlmtdclkddp1q3tgtegadfn.apps.googleusercontent.com',
	client_secret: 'jUYCXN5rksSi3ru3xdJk_xLU',
	api_scope: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/classroom.coursework.me'
});

if(googleAuth.getAccessToken() == null) {
	url = browser.extension.getURL("/content/addon-page/addon-page.html#page=dashboard");
	window.location.replace(url);
}
else {
	googleAuth.authorize(function() {
		chrome.storage.local.set({token:googleAuth.getAccessToken()})
		$.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json",{access_token:googleAuth.getAccessToken()},function(data) {
			uppicture = data.picture;
			if(uppicture.substring(0,6) != "https:") {
				uppicture = 'https:'+uppicture;
			}
			$('#userphoto').empty();
			$('#userphoto').append('<img style="width: 40px;height: 40px;margin-right: 20px;border-radius: 30px;margin-top: 5px;" src="'+uppicture+'">');
		});
	});
}



$(document).ready(function() {


	//Get All Courses
	getCourses();

	//Get All Courses on from main menu
	$(document).on('click','#menu-courses',function(){
		$('#sm-menu-box').hide(100);
		getCourses();
	});


	//Get All Courses on from main menu
	$(document).on('click','#menu-dictionary',function(){
		$('#sm-menu-box').hide(100);
		$('#sm-main-container').empty();
		$('#sm-secondary-menu').empty();
		$('#sm-secondary-menu').append('<div class="col-sm-12"><div id="di_field_cn" style="text-align: center;padding: 10px;border: 1px solid #cbcbcb;background: #f8f8f8;"><div><input style="width: 100%;" type="text" name="" id="search"></div><div style="margin: 10px;">Search By</div><div style="margin: 10px;"><input style="display: initial;" type="radio" name="by" value="tag"> Tag<input style="display: initial;" type="radio" name="by" value="eword" checked="checked">  English Word<input style="display: initial;" type="radio" name="by" value="jword"> Japanese Word<input style="display: initial;" type="radio" name="by" value="kana"> Kana</div><div style="margin: 10px;"><button id="search_btn">Search</button></div></div></div><div class="col-sm-12" id="di_words_cn"></div>');
		
	});


	//Get Single Course Detail
	$(document).on('click','.sm-get-single-course',function(){
		var id = $(this).attr('id');
		getSingleCourse(id);
	});


	//Get Single Course From secondary menu sm-posts
	$(document).on('click','#sm-posts',function(){
		var id = $(this).attr('data-id');
		getSingleCourse(id);
	});

	//Get Students and teacher of a curse
	$(document).on('click','#sm-peoples',function(){
		var id = $(this).attr('data-id');
		getCoursePeoples(id);
	});


	//Display Main Menu 
	$(document).on('click','#sm-menu',function(){
		$('#sm-menu-box').animate({width:'toggle'},100);
	});

	//Close main Menu
	$(document).on('click','#sm-menu-close',function(){
		$('#sm-menu-box').hide(100);
	});



});


function smLoader($arg) {
	if($arg == "show"){
		$('#overlay').show();
		$('.loader').show();
	}
	else {
		$('#overlay').hide();
		$('.loader').hide();
	}
}


function getCourses() {
	smLoader('show');
	$.ajax({
		url:"https://classroom.googleapis.com/v1/courses",
		data:{access_token:googleAuth.getAccessToken()},
		success:function(data) {
			if(data.courses) {
				var html = '<div class="card-columns">';
				$(data.courses).each(function(ii,course){
					html = html + '<div class="card" style="width: 18rem;"><img class="card-img-top" style="width: 100%;height: 100px;" src="images/course-background.jpg" alt="Card image cap"><div class="card-body"><h5  class="card-title sm-get-single-course" id="'+course.id+'">'+course.name+'</h5><p class="card-text">'+course.section+' (Code : '+course.enrollmentCode+')</p></div></div>';
				});
				html = html + '</div>';
				$('#sm-main-container').empty();
				$('#sm-secondary-menu').empty();
				$('#sm-main-container').append(html);
			}
			else {
				console.log(data);
			}
			smLoader('hide');
		},
		error:function(err) {
			console.log(err);
			smLoader('hide');
		}
	});
}


function getSingleCourse(id) {
	smLoader('show');
	$.ajax({
		url:"https://classroom.googleapis.com/v1/courses/"+id+"/announcements",
		data:{access_token:googleAuth.getAccessToken()},
		success:function(data) {
			if(data.announcements) {
				var an_lenth = data.announcements.length;
				var html = '';
				$(data.announcements).each(function(ii,announcement){
					var uname = '';
					var upicture = '';
					$.ajax({
						url:"https://classroom.googleapis.com/v1/userProfiles/"+announcement.creatorUserId,
						data:{access_token:googleAuth.getAccessToken()},
						success:function(data1) {
							uname = data1.name.fullName;
							upicture = data1.photoUrl;
							    if(upicture.substring(0,6) != "https:") {
							    	upicture = 'https:'+upicture;
							    }
								//comment_html = '<div class="sm-comment-container"><div class="row"><div class="col-sm-1"><img style="width: 30px;height: 30px;border-radius: 20px" src="images/course-background.jpg"></div><div class="col-sm-11" style="padding: 0px;"><span>Muhammad Usama Abdullah</span> <span>22:00</span></div></div><div class="row"><div class="col-sm-12 comment-text">12212</div></div></div>';
								html = html + '<div class="timeline-centered"><div class="row" style="margin: 10px;"><div class="col-sm-1"><img style="width: 40px;height: 40px;border-radius: 20px" src="'+upicture+'"></div><div class="col-sm-11"><div>'+uname+'</div><div style="font-size: 12px;">22:00</div></div></div><div class="row" style="margin: 10px;"><div class="col-sm-12 timeline-text">'+announcement.text+'</div></div></div>';
								if(ii + 1 >= data.announcements.length) {
									displayAnnouncments(ii,data.announcements,html,id);
								}
							},
							error:function(err) {
								console.log(err);
								html = html + '<div class="timeline-centered"><div class="row" style="margin: 10px;"><div class="col-sm-1"><img style="width: 40px;height: 40px;border-radius: 20px" src="images/course-background.jpg"></div><div class="col-sm-11"><div>Private</div><div style="font-size: 12px;">22:00</div></div></div><div class="row" style="margin: 10px;"><div class="col-sm-12 timeline-text">'+announcement.text+'</div></div></div>';
								if(ii + 1 >= data.announcements.length) {
									displayAnnouncments(ii,data.announcements,html,id);
								}
							}
						});
				});
			}
			else {
				console.log(data);
				displayAnnouncments(0,0,'',id);
			}
		},
		error:function(err) {
			console.log(err);
			smLoader('hide');
		}
	});
}


function getCoursePeoples(id) {
	smLoader('show');
	$.ajax({
		url:"https://classroom.googleapis.com/v1/courses/"+id+"/teachers",
		data:{access_token:googleAuth.getAccessToken()},
		success:function(data) {
			var thtml = '<div class="col-sm-12">';
			if(data.teachers) {
				$(data.teachers).each(function(ii,teacher){
					upicture = teacher.profile.photoUrl;
					if(upicture.substring(0,6) != "https:") {
						upicture = 'https:'+upicture;
					}
					thtml = thtml + '<div class="sm-peoples-list"><div class="row" style="margin: 10px;"><div class="col-sm-1"><img style="width: 40px;height: 40px;border-radius: 20px" src="'+upicture+'"></div><div class="col-sm-11"><div>'+teacher.profile.name.fullName+'</div><div style="font-size: 12px;">Teacher</div></div></div></div>';
				});
			}
			else {
				thtml = thtml + '<div class="sm-peoples-list" style="text-align: center;">0 Teacher</div>';
			}
			var thtml = thtml + '</div>';
			$('#sm-main-container').empty();
			$('#sm-main-container').append(thtml);
			$('#sm-secondary-menu').empty();
			$('#sm-secondary-menu').append('<div class="col-sm-6 sm-secondary-items" id="sm-posts" data-id="'+id+'">Posts</div><div class="col-sm-6 sm-secondary-items sm-secondary-items-active" id="sm-peoples" data-id="'+id+'">Peoples</div>');
		},
		error:function(err) {
			console.log(err);
		}
	}).then(function(){

		$.ajax({
			url:"https://classroom.googleapis.com/v1/courses/"+id+"/students",
			data:{access_token:googleAuth.getAccessToken()},
			success:function(data) {
				var thtml = '<div class="col-sm-12">';
				if(data.students) {
					$(data.students).each(function(ii,student){
						upicture = student.profile.photoUrl;
						if(upicture.substring(0,6) != "https:") {
							upicture = 'https:'+upicture;
						}
						thtml = thtml + '<div class="sm-peoples-list"><div class="row" style="margin: 10px;"><div class="col-sm-1"><img style="width: 40px;height: 40px;border-radius: 20px" src="'+upicture+'"></div><div class="col-sm-11"><div>'+student.profile.name.fullName+'</div><div style="font-size: 12px;">Student</div></div></div></div>';
					});
				}
				else {
					thtml = thtml + '<div class="sm-peoples-list" style="text-align: center;">0 Student</div>';
				}
				var thtml = thtml + '</div>';
				$('#sm-main-container').append(thtml);
				smLoader('hide');
			},
			error:function(err) {
				console.log(err);
			}
		});

	});
}


function displayAnnouncments(itr , announcements , html, id) {
	if(itr + 1 < announcements.length) {
		return false;
	}
	var dhtml = '<div class="col-sm-3"></div><div class="col-sm-9">'+html+'</div>';
	$('#sm-main-container').empty();
	$('#sm-main-container').append(dhtml);
	$('#sm-secondary-menu').empty();
	$('#sm-secondary-menu').append('<div class="col-sm-6 sm-secondary-items sm-secondary-items-active" id="sm-posts" data-id="'+id+'">Posts</div><div class="col-sm-6 sm-secondary-items" id="sm-peoples" data-id="'+id+'">Peoples</div>');
	smLoader('hide');
}