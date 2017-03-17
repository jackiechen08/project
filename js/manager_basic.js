	var status1=false;
	var status2=false;
	var status3=false;
	var room_type;
	var pic_type;
	var location_info;
	var file_name;
	function pic_function(){
		var selected = document.getElementById('picture_variety').value;
        
        switch(selected){
        	case "1":
 				$( "#show_example" ).html( '<br><form action="#"><div class="file-field input-field"><div class="btn"><span>上傳全景圖</span><input type="file" id="mypic" onchange="detected_file()" multiple></div><div class="file-path-wrapper"><input class="file-path validate" type="text" placeholder="可上傳多個照片"></div></div></form><br><br><h5>預覽區: </h5>' );        
        		pic_type=1;
        		break;

        	case "2":
                $( "#show_example" ).html(' <br><form action="#"><div class="file-field input-field"><div class="btn"><span>上傳平面圖</span><input type="file" id="mypic" onchange="detected_file()"></div><div class="file-path-wrapper"><input class="file-path validate" type="text"></div></div></form><br><br><h5>預覽區: </h5>');
                pic_type=2;
                break;

        	case "3":
        		 $( "#show_example" ).html(' <br><form action="#"><div class="file-field input-field"><div class="btn"><span>上傳KML檔</span><input type="file" id="mypic" onchange="detected_file()"></div><div class="file-path-wrapper"><input class="file-path validate" type="text"></div></div></form><br><br><h5>預覽區: </h5>');
        		pic_type=3;
        		break;

        	case "-1":
        	 $( "#show_example" ).html('');       		
        		break;
        }
	}

	function type_choice(choice_num){
		switch(choice_num){

			case 1:
				Materialize.toast('你已選擇了餐廳類型!!', 1500);
				$( "#status_02" ).html('<h3>2.選擇你的預約空間類型 <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>');
				status2 = true;
				room_type = 1;
				break;

			case 2:
				Materialize.toast('你已選擇了自習室類型!!', 1500);
				$( "#status_02" ).html('<h3>2.選擇你的預約空間類型 <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>');
				status2 = true;
				room_type = 2;
				break;

			case 3:
				Materialize.toast('你已選擇了會議室類型!!', 1500);
				$( "#status_02" ).html('<h3>2.選擇你的預約空間類型 <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>');
				status2 = true;
				room_type = 3;
				break;

			case 4:
				$( "#input_description" ).html();
				Materialize.toast('你已選擇了球場類型!!', 1500);
				$( "#status_02" ).html('<h3>選擇你的預約空間類型 <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>');
				status2 = true;
				room_type = 4;
				break;

			case 5:
				Materialize.toast('你已選擇了營地類型!!', 1500);
				$( "#status_02" ).html('<h3>選擇你的預約空間類型 <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>');
				status2 = true;
				room_type = 5;
				break;
		}
	}

	function detected_file(){
              var x = document.getElementById("mypic");

               if ('files' in x) {
                   if(x.files.length==0){
                   	status3=false;
                    $('#status_03').html('<h3>3.上傳你的全景或平面圖 <i class="fa fa-times" aria-hidden="true" style="color: red;"></i></h3>');
                    file_name="";
                   }else{
                      status3=true;
                      $('#status_03').html('<h3>3.上傳你的全景或平面圖 <i class="fa fa-check" aria-hidden="true" style="color: green;"></i></h3>');
                      var file = x.files[0];
                      file_name=file.name;                      
                   }              
               }

	}

	function verify(){
		if(status1&&status2){	
		    document.location.href="manager_setspace.html?RoTy="+room_type;				     
		} else{
			$('#modal1').modal('open');
		}
	}


