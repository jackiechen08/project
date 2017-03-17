var countMarker = 0;
var panomap;
var PoV = {lat: 24.1220135, lng: 120.679516};

var roomtypeconfirm,panorama,latlng;
//kml map的marker增加位置

var markers_num = 0;//kml 's tmp marker number'
var pmarkers_num = 0;//pano's tmp marker number
//To storage markers
var SVmarkers = [];
var SVLocs = [];
//To check if thee pre marker has been stock on or not
var checkNum = 0;
var submitOrNot = 2;

var pic_type;
var map;
var infoWindow;
var panoid;

//initmap()為kml的initialize

function initMap(point_arr,polygon_arr) {
    var initial_position = point_arr[0].split(",");
    map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 17,
	    center: new google.maps.LatLng(initial_position[1], initial_position[0]),
	    mapTypeId: google.maps.MapTypeId.TERRAIN
  	});
    latlng = new google.maps.LatLng(initial_position[1], initial_position[0]);

    //plant the marker  	
   	//marker 
    if(point_arr.length!=0){
        for(var i=0;i<point_arr.length;i++){
            //split each point's position string           
            var real_position=point_arr[i].split(",");
            var marker = new google.maps.Marker({
            position: new google.maps.LatLng(real_position[1], real_position[0]),
            map: map           
          });
            marker.setMap(map);
        }
    }
	//maker
	if(polygon_arr.length!=0){
		for(var i=0;i<polygon_arr.length;i++){
		  	//分析Coordinates
		  	var polygon_position=[];
		  	var polygonChange = polygon_arr[i].split(" ");
			for(var j=0;j<polygonChange.length;j++){
			    polygon_position = polygon_position.concat(polygonChange[j].split(","));
			}
	  
	  // Define the LatLng coordinates for the polygon.
		  	var polygonCoords =[ ];
		  	for(var k=0;k<polygon_position.length/3;k++){ 
		    	polygonCoords.push(new google.maps.LatLng(parseFloat(polygon_position[k*3+1]), parseFloat(polygon_position[k*3])));
		 	}

		  	// Construct the polygon.
		  	var polygons = new google.maps.Polygon({
		    	paths: polygonCoords,
			    strokeColor: '#FF0000',			
			    strokeOpacity: 0.8,
			    strokeWeight: 3,	
			    fillColor: '#FF0000',
			    fillOpacity: 0.35
		  	});
	  		polygons.setMap(map);  
		}
		//Add a listener for the click event.
		polygon.addListener('click', showArrays);

		infoWindow = new google.maps.InfoWindow;
	}
}

function showArrays(event) {
	  // Since this polygon has only one path, we can call getPath() to return the
	  // MVCArray of LatLngs.
	  var vertices = this.getPath();

	  var contentString = '<b>Polygon</b><br>' +
	      'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
	      '<br>';

	  // Iterate over the vertices.
	  for (var i =0; i < vertices.getLength(); i++) {
	    var xy = vertices.getAt(i);
	    contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
	        xy.lng();
	  }

	  // Replace the info window's content and position.
	  infoWindow.setContent(contentString);
	  infoWindow.setPosition(event.latLng);
	  infoWindow.open(map);
}

//read kml file
function readBlob(){

    var files = document.getElementById('mypic').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
    //store points lat and lng
    var points_position=[];
	var polygons_position=[];
    var file = files[0];
    var start = 0;
    var stop = file.size - 1;

    var reader = new FileReader();
    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        document.getElementById('byte_content').innerHTML = evt.target.result;
          var tag_len=document.getElementById('byte_content').getElementsByTagName("Point").length;
		  var tag_poy=document.getElementById('byte_content').getElementsByTagName("Polygon").length;
         
		
        for(var i=0;i<tag_len;i++){         
          points_position.push(document.getElementsByTagName("Point")[i].getElementsByTagName("coordinates")[0].innerHTML);
        }
		
	    for(var i=0;i<tag_poy;i++){		  
          polygons_position.push(document.getElementsByTagName("Polygon")[i].getElementsByTagName("coordinates")[0].innerHTML);
        }
        initMap(points_position,polygons_position);
        document.getElementById('byte_range').textContent = 
            ['Read bytes: ', start + 1, ' - ', stop + 1,
             ' of ', file.size, ' byte file'].join('');
      }
     
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

//kml marker
function addmarker(latilongi) {
        var roomcontent=document.getElementById('show_roominfo').innerHTML;
        roomcontent=roomcontent.slice(0,- 5);
        document.getElementById('show_roominfo').innerHTML=roomcontent;

        
        markers_num++;
	    var marker = new google.maps.Marker({
	        position: latilongi,
	        title: 'new marker',
	        draggable: true,
	        map: map
	    });
	     map.setCenter(marker.getPosition());

	     roomcontent+='<li><div class="collapsible-header"><i class="material-icons">filter_drama</i>Place'+markers_num+'</div><div class="collapsible-body"><span>空間資訊</span></div></li>'+'</ul>';
	     document.getElementById('show_roominfo').innerHTML=roomcontent;
	     $('.collapsible').collapsible();         
}

var file_name, tmplat, tmplng;

//Pano marker
function newMarker(marker_type)
{
	var i = SVmarkers.length;
	var tmplat = panorama.getPosition().lat() - 0.00005;
	var tmplng = panorama.getPosition().lng() - 0.00005;
	checkNum = 1;

	pmarkers_num++;

	//要在新增type請在這裡新增
	switch(marker_type){
		case 1:
				SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/專題icon-01.png',
					position: {lat: tmplat, lng: tmplng},
					Mtype: "room",
					x: i+1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mname: "ur room name",
					MDescription: "write ur description"

				});

				break;

		case 2 :
		        SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/專題icon-06.png',
					position: {lat: tmplat, lng: tmplng},
					x: i+1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mtype: "wc",
					Mname: "ur wc name",
					MDescription: "write ur description",
					male: "0",
					female:"0"
				});
				break;

		case 3 :
		        SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/專題icon-03.png',
					position: {lat: tmplat, lng: tmplng},
					Mtype: "handicap",
					x: i+1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mname: "handicap",
					MDescription: "ur description"
				});
				break;

		case 4 :
		        SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/heart.png',
					position: {lat: tmplat, lng: tmplng},
					Mtype: "medkit",
					x: i+1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mname: "MEDKIT NAME",
					MDescription: "description",
					RegisterDate: "date(be honest)"
				});
				break;

		case 5 :
		        SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/專題icon-02.png',
					position: {lat: tmplat, lng: tmplng},
					Mtype: "electric",
					x: i+1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mname: "electricName",
					MDescription: "使用電壓限制"
				});
				break;

		case 6 :
		        SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/專題icon-05.png',
					position: {lat: tmplat, lng: tmplng},
					Mtype: "WaterSource",
					x: i+1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mname: "WaterSource",
					MDescription: "水源使用範圍",
					HotWaterTime: "熱水供應時間"
				});
				break;
		case 7 :
		        SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/house_extinguisher.png',
					position: {lat: tmplat, lng: tmplng},
					Mtype: "FireExtinguisher",
					x: i + 1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mname: "extinguisher",
					MDescription: "description",
					RegisterDate: "date(be honest)"
				});
				break;
		case 8 :
		        SVmarkers[i] = new google.maps.Marker({
					map: panorama,
					draggable: true,
					icon: 'img/專題icon-08.png',
					position: {lat: tmplat, lng: tmplng},
					Mtype: "EmergencyExit",
					x: i + 1,	// 這個自訂變數是為了addListener()可得到正確的i值
					Mname: "EmergencyExit",
					MDescription: "位置描述"
				});
				break;
		
	}
	var marker_choose;

	// 監聽這個marker被點擊事件
	google.maps.event.addListener(SVmarkers[i],'click',function(evt) {
		    
        marker_choose = i;
	    //顯示marker資訊
	    switch(this['Mtype']){
	    	case "room":
		    	document.getElementById("show_roominfo").innerHTML = '<div class="row"><div class="input-field col s12 m8 l8">座位名稱:<input value="'+this['Mname']+'" id="marker_Name" type="text" class="validate">座位資訊:<input value="'+this['MDescription']+'" id="marker_describ" type="text" class="validate"></div></div><div class="btn" onclick="saveSeatInfo('+marker_choose+')"><span>Save</span><br>';
		    	break;

	    	case "wc":
	    		document.getElementById("show_roominfo").innerHTML = '<div class="row"><div class="input-field col s12 m8 l8">廁所設施名稱:<input value="'+this['Mname']+'" id="marker_Name" type="text" class="validate">廁所設施資訊:<input value="'+this['MDescription']+'" id="marker_describ" type="text" class="validate">男廁數:<input value="'+this['male']+'" id="male_num" type="text" class="validate">女廁數:<input value="'+this['female']+'" id="female_num" type="text" class="validate"></div></div><div class="btn" onclick="saveSeatInfo('+marker_choose+')"><span>Save</span><br>';
		    	break;
		    				        
	    	case "handicap":
	    		document.getElementById("show_roominfo").innerHTML = '<div class="row"><div class="input-field col s12 m8 l8">殘障設施名稱:<input value="'+this['Mname']+'" id="marker_Name" type="text" class="validate">殘障設施資訊:<input value="'+this['MDescription']+'" id="marker_describ" type="text" class="validate"></div></div><div class="btn" onclick="saveSeatInfo('+marker_choose+')"><span>Save</span><br>';
		    	break;
		    				        
	    	case "medkit":
	    		document.getElementById("show_roominfo").innerHTML = '<div class="row"><div class="input-field col s12 m8 l8">醫護用具名稱:<input value="'+this['Mname']+'" id="marker_Name" type="text" class="validate">醫護用具資訊:<input value="'+this['MDescription']+'" id="marker_describ" type="text" class="validate">用具保養日期:<input value="'+this['RegisterDate']+'" id="reg_date" type="text" class="validate"></div></div><div class="btn" onclick="saveSeatInfo('+marker_choose+')"><span>Save</span><br>';
		    	break;
		    				        
		    case "electric":
		    	document.getElementById("show_roominfo").innerHTML = '<div class="row"><div class="input-field col s12 m8 l8">插座位置:<input value="'+this['Mname']+'" id="marker_Name" type="text" class="validate">使用電壓限制:<input value="'+this['MDescription']+'" id="marker_describ" type="text" class="validate"></div></div><div class="btn" onclick="saveSeatInfo('+marker_choose+')"><span>Save</span><br>';
		    	break;

		    case "WaterSource":
		    	document.getElementById("show_roominfo").innerHTML = '<div class="row"><div class="input-field col s12 m8 l8">水源位置:<input value="'+this['Mname']+'" id="marker_Name" type="text" class="validate">水源用途:<input value="'+this['MDescription']+'" id="marker_describ" type="text" class="validate">熱水供應時段:<input value="' + this['HotWaterTime'] +'" id = "hotwater" type = "text" class = "validate"></div></div><div class="btn" onclick="saveSeatInfo('+marker_choose+')"><span>Save</span><br>';
		    	break;
		    case "FireExtinguisher":
	    		document.getElementById("show_roominfo").innerHTML = '<div class="row"><div class="input-field col s12 m8 l8">消防設施名稱:<input value="'+this['Mname']+'" id="marker_Name" type="text" class="validate">消防設施資訊:<input value="'+this['MDescription']+'" id="marker_describ" type="text" class="validate">設施使用期限:<input value="'+this['RegisterDate']+'" id="reg_date" type="text" class="validate"></div></div><div class="btn" onclick="saveSeatInfo('+marker_choose+')"><span>Save</span><br>';
		    	break;
	    }
	});
}
// Save 在show_roominfo這邊輸入的座位資訊到marker中
function saveSeatInfo(xValue){
	
	switch(SVmarkers[xValue].Mtype){
		case "room":
			SVmarkers[xValue].Mname=document.getElementById('marker_Name').value;
			SVmarkers[xValue].MDesciption=document.getElementById('marker_describ').value;
		break;

		case "wc":
			SVmarkers[xValue].Mname=document.getElementById('marker_Name').value;
			SVmarkers[xValue].MDesciption=document.getElementById('marker_describ').value;
			SVmarkers[xValue].male=document.getElementById('male_num').value;
			SVmarkers[xValue].female=document.getElementById('female_num').value;
		break;

		case "handicap":
			SVmarkers[xValue].Mname=document.getElementById('marker_Name').value;
			SVmarkers[xValue].MDesciption=document.getElementById('marker_describ').value;
		break;

		case "medkit":
			SVmarkers[xValue].Mname=document.getElementById('marker_Name').value;
			SVmarkers[xValue].MDesciption=document.getElementById('marker_describ').value;
			SVmarkers[xValue].RegisterDate=document.getElementById('reg_date').value;
		break;

		case "electric":
			SVmarkers[xValue].Mname=document.getElementById('marker_Name').value;
			SVmarkers[xValue].MDesciption=document.getElementById('marker_describ').value;
		break;

		case "WaterSource":
			SVmarkers[xValue].Mname=document.getElementById('marker_Name').value;
			SVmarkers[xValue].MDesciption=document.getElementById('marker_describ').value;
			SVmarkers[xValue].RegisterDate=document.getElementById('hotwater').value;
		break;

		case "FireExtinguisher":
			SVmarkers[xValue].Mname=document.getElementById('marker_Name').value;
			SVmarkers[xValue].MDesciption=document.getElementById('marker_describ').value;
			SVmarkers[xValue].RegisterDate=document.getElementById('reg_date').value;
		break;
	}				
	Materialize.toast('儲存成功!', 2000)
	document.getElementById('show_roominfo').innerHTML='';
}
//end
function detected_file(){
	if(pic_type==1){
		tmplat = document.getElementById('first_lat').value;
		tmplng = document.getElementById('first_lng').value;
		PoV = {lat: parseFloat(tmplat), lng: parseFloat(tmplng)}; // 字串會沒有東西//24.1237996, 120.6750908
		if(tmplat ==0 || tmplng == 0)
			alert('經緯度欄不能為空');
		else{
   
		  	panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
				center: PoV,
				zoom: 1,			
		  	});
		  
		  // 注意這裡是擷取預設的「街景服務」全景，請在 Map 物件上呼叫 getStreetView()。
		  	
		  	panorama.setPosition(PoV);
		  	panorama.setPov(({
				heading: 200,
				pitch: -20
		  	}));
		  	// set panorama visible.
		  	panorama.setVisible(true);	 
		  	
		  	panorama.addListener('pano_changed', function() {
		            if(submitOrNot == 1 && SVLocs.length == 0)
		            {
		            	alert("即將切換不同張全景圖，所有資料已上傳");
		            	submitOrNot = 0;
		            }
		            else if(submitOrNot == 0 && SVLocs.length != 0)
		            {
		            	alert("資料尚未上傳，已代為上傳");
		            	submitOrNot = 2;
		            	//上傳至Firebase
		            }
		            else
		            {
		            	submitOrNot = 0;
		            }
		            
		    });

		    //在這邊再把按鈕放出來
		    $("#show_add_marker_btn").html(roomtypeconfirm);
		  	$("#submit_btn").html('<div class="btn" onclick="toFirebase()"><span>送出</span></div><br><br>');
		  	//init firebase
		  
		}
		//$( "#content" ).html(' <div id="marker_button"><input type="button" class="btn btn-primary btn-lg" name="addSpot" onclick="newMarker(document.getElementById('seatname'),document.getElementById('seatnum'),document.getElementById('seatpos')) ;" value ="新增座位" style="height: 50%" ><input type = "button" class="btn btn-primary btn-lg"  name = "SubmitMarker" onclick="getMarker()" value = "送出" style="height: 50%"><div id="space_title" style="font-size: 30px;color: rgb(35, 32, 29);font-family:Microsoft JhengHei">目前的座位</div><br><div id="pano" style="height:80%"></div><div id="space_set" style="height:80%"><div class="panel-group" id="accordion"></div></div></div><br><br><!-- emergente div part--><!-- <div id="new" class="white_content">物件名稱:<textarea id="seatname" rows="1" cols="30"></textarea><br>物件描述:<textarea id="seatnum" rows="1" cols="30"></textarea><br><input type="submit" value="Submit" onclick="document.getElementById('new').style.display='none';document.getElementById('fade').style.display='none'; newMarker(document.getElementById('seatname'),document.getElementById('seatnum'),document.getElementById('seatpos')) ;createchkboxes()"><br><a href="javascript:void(0)" onclick="document.getElementById('new').style.display='none';document.getElementById('fade').style.display='none'">Close</a></div>  --><div id="light" class="white_content"><div id = "msg"></div> <a href="javascript:void(0)" onclick="document.getElementById('light').style.display='none'">Close</a></div><div id="fade" class="black_overlay"></div>');

	}else if(pic_type==2){

	}else if(pic_type==3){
		$( "#show_pic" ).html('	<a class="btn-floating red btn-large waves-effect waves-light" id="add_normal_marker" onclick="addmarker(latlng)"><i class="material-icons">add</i></a><br><div id="byte_range" hidden></div><div id="byte_content" hidden></div><div id="map"></div>');
		readBlob();

	}  
}

//After clicked 送出
function toFirebase(){
	var config = {
			    apiKey: "AIzaSyCcpXVxXydVYI0MoyrVai9uGhcLW1yCvwE",
			    authDomain: "manager-16d00.firebaseapp.com",
			    databaseURL: "https://manager-16d00.firebaseio.com",
			    storageBucket: "manager-16d00.appspot.com",
			    messagingSenderId: "855157254941"
			};
			var done_status=false;
			firebase.initializeApp(config);
			
			panoid=panorama.getPano();
			firebase.database().ref(panoid).set('');
			var all_marker_type=[["room",0],["wc",0],["handicap",0],["medkit",0],["electric",0],["WaterSource",0],["FireExtinguisher",0]];
		    for(var i=0;i<SVmarkers.length;i++){
		    	for(var j=0;j<all_marker_type.length;j++){
		    		if(SVmarkers[i].Mtype==all_marker_type[j][0]){
		    			all_marker_type[j][1]+=1;
		    		    SVmarkers[i].x=all_marker_type[j][1];}
		    	}
             firebase.database().ref(panoid+'/'+SVmarkers[i].Mtype+'/marker'+SVmarkers[i].x+'/name').set(SVmarkers[i].Mname);
             firebase.database().ref(panoid+'/'+SVmarkers[i].Mtype+'/marker'+SVmarkers[i].x+'/description').set(SVmarkers[i].MDescription);
             firebase.database().ref(panoid+'/'+SVmarkers[i].Mtype+'/marker'+SVmarkers[i].x+'/positon/lat').set(SVmarkers[i].getPosition().lat());
             firebase.database().ref(panoid+'/'+SVmarkers[i].Mtype+'/marker'+SVmarkers[i].x+'/positon/lng').set(SVmarkers[i].getPosition().lng());
		    }
            for(var i=0;i<all_marker_type.length;i++){
            	if(all_marker_type[i][1]!=0){
            		firebase.database().ref(panoid+'/'+all_marker_type[i][0]+'/marker_num').set(all_marker_type[i][1],function(error){
            			if(error){
            				console.log('error');
            			}else{
            				document.location.href="manager_detail.html?Pano="+panoid;	
            			}
            		});
            	}
            	
            }
      
}


function pic_function(){
	//根據不同範本類型產生不同marker 清單
	var QueryString = function () {
	  // This function is anonymous, is executed immediately and 
      // the return value is assigned to QueryString!
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
		  query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
		  var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
		  query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
		  query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	  } 
	  return query_string;
	}();
	//根據選擇的場域類型做Marker轉換
	roomtype_info=[];
	roomtype_info.push(QueryString.RoTy);
	roomtypeconfirm='';

	var roomtype1= '<a class="btn-floating black btn-large" onclick="newMarker('+1+')"><i class="material-icons">room</i></a> <a class="btn-floating light-blue btn-large" onclick="newMarker('+2+')"><i class="material-icons">wc</i></a> <a class="btn-floating blue btn-large" onclick="newMarker('+3+')"><i class="fa fa-wheelchair" aria-hidden="true"></i></a> <a class="btn-floating red btn-large" onclick="newMarker('+4+')"><i class="fa fa-medkit" aria-hidden="true"></i></a>';
	var roomtype2= '<a class="btn-floating black btn-large" onclick="newMarker('+1+')"><i class="material-icons">room</i></a> <a class="btn-floating light-blue btn-large" onclick="newMarker('+2+')"><i class="material-icons">wc</i></a> <a class="btn-floating blue btn-large" onclick="newMarker('+6+')"><i class="fa fa-tint"></i></a> <a class="btn-floating red btn-large" onclick="newMarker('+5+')"><i class="fa fa-plug" aria-hidden="true"></i></a>';
	var roomtype3= '<a class="btn-floating black btn-large" onclick="newMarker('+1+')"><i class="material-icons">room</i></a> <a class="btn-floating blue btn-large" onclick="newMarker('+7+')"><i class="fa fa-fire-extinguisher"></i></a> <a class="btn-floating blue btn-large" onclick="newMarker('+6+')"><i class="fa fa-tint"></i></a> <a class="btn-floating red btn-large" onclick="newMarker('+5+')"><i class="fa fa-plug" aria-hidden="true"></i></a>';
	var roomtype4= '<a class="btn-floating black btn-large" onclick="newMarker('+1+')"><i class="material-icons">room</i></a> <a class="btn-floating blue btn-large" onclick="newMarker('+6+')"><i class="fa fa-tint"></i></a> ';
	switch(QueryString.RoTy){
		case "1":
			roomtypeconfirm=roomtype1;
			break;
			
		case "2":
			roomtypeconfirm=roomtype2;
			break;
			
		case "3":
			roomtypeconfirm=roomtype3;
			break;
			
		case "4":
			roomtypeconfirm=roomtype4;
			break;
	}
	//根據選擇不同模式(全景平面,KML)
	var selected = document.getElementById('picture_variety').value;
    
    switch(selected){
    	case "1":
				$( "#show_example" ).html( '<br><br><h4>如何取得全景圖的Pano ID?</h4><br><div class="btn"><span>教你取得全景圖PanoID</span></div><br><br><h4>輸入全景圖的經緯度</h4><br> <div class="row"><div class="input-field col s12 m6 l3">你的lat:<input value="24.1219635" id="first_lat" type="text" class="validate">你的lng:<input value=" 120.67946" id="first_lng" type="text" class="validate"></div></div><div class="btn" onclick="detected_file()"><span>送出全景圖經緯度</span><br><br></div>' );        
    		pic_type=1;        
    		
    		break;

    	case "2":
            $( "#show_example" ).html(' <br><form action="#"><div class="file-field input-field"><div class="btn"><span>上傳平面圖</span><input type="file" id="mypic" onchange="detected_file()"></div><div class="file-path-wrapper"><input class="file-path validate" type="text"></div></div></form><br><br>');
            pic_type=2;
            break;

    	case "3":
    		 $( "#show_example" ).html(' <br><form action="#"><div class="file-field input-field"><div class="btn"><span>上傳KML檔</span><input type="file" id="mypic" onchange="detected_file()"></div><div class="file-path-wrapper"><input class="file-path validate" type="text"></div></div></form><br><br>');
    		pic_type=3;
    		break;

    	case "-1":
    	 $( "#show_example" ).html('');       		
    		break;
    }
}