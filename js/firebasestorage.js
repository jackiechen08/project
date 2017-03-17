 var progress;
 var config = {
    apiKey: "AIzaSyCcpXVxXydVYI0MoyrVai9uGhcLW1yCvwE",
    authDomain: "manager-16d00.firebaseapp.com",
    databaseURL: "https://manager-16d00.firebaseio.com",
    storageBucket: "manager-16d00.appspot.com",
    messagingSenderId: "855157254941"
  };
  firebase.initializeApp(config);
var storageRef = firebase.storage().ref();
function file_upload(PType,InputID){

  	var uploadFileInput = document.getElementById(InputID);
	if(PType==3){						
		var file = uploadFileInput.files[0];
		var uploadTask = storageRef.child('mymap/'+file.name).put(file);
		uploadTask.on('state_changed', function(snapshot){
			    // Observe state change events such as progress, pause, and resume
			    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			    progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	             $('#modal3').modal('open');
			    console.log('Upload is ' + progress + '% done');

			    switch (snapshot.state) {
			      	case firebase.storage.TaskState.PAUSED: // or 'paused'
			        	console.log('Upload is paused');
			        	break;
			      	case firebase.storage.TaskState.RUNNING: // or 'running'
			        	console.log('Upload is running');
			        	break;
			    }
			}, function(error) {
			    // Handle unsuccessful uploads
			}, function() {
			    // Handle successful uploads on complete
			    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
			    var downloadURL = uploadTask.snapshot.downloadURL;
			});
	}
}