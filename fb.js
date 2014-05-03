var workingtime = new Firebase('https://flickering-fire-282.firebaseio.com/workingtime');
var array = new Array();

function WorkingTime(){
  this.idwt=1;
  this.employee = 0;
  this.captCheckin = new Blob();
  this.checkin = new Date();
  this.captCheckout = "";
  this.checkout = "";
}


workingtime.on('child_added', function(snapshot) {
  	var wt = snapshot.val();
	array.push(wt);
	reloadwts(array);	
});

workingtime.on('child_changed', function(snapshot, prevChild) {
	for (var i = 0; i < array.length; i++) {
		if(array[i].idwt == snapshot.val().idwt){
			array[i] = snapshot.val();
		}
	};
	reloadwts(array);	
});

function performCheckin(img, employee){

	workingtime.once("value", function(snapshot){
			var wt = new WorkingTime();
	wt.employee = employee;
		wt.idwt = snapshot.numChildren() + 1;
		wt.checkin = new Date().toString();
	wt.captCheckin = img;
	var wtchild = new Firebase('https://flickering-fire-282.firebaseio.com/workingtime/'+wt.idwt);
	wtchild.setWithPriority(wt,employee);
	});
}

function performCheckout(img,wt){
	wt.checkout = new Date().toString();
	wt.captCheckout = img;
	console.log("wt "+wt.idwt+" img "+wt.captCheckout+" checkout "+wt.checkout);
	var wtChild = workingtime.child(wt.idwt);
	wtChild.set(wt);

}

function isACheckin(employee){
	var flag = false;
	workingtime.once("value", function(snapshot){
		if(snapshot.numChildren() != 0){
			snapshot.forEach(function(snap){
				console.log("snap "+snap.val().idwt);

				var checkoutSearch = workingtime.child(snap.val().idwt).startAt(employee,snap.name()).once("value", function(data){
					if(snap.val().employee == employee){
						if(snap.val().checkout === ""){
							console.log("para checkout "+snap.val().employee);
							doCheckout(snap.val());
							flag=true;
						}
					}
				});
			});
			/*
			console.log("snapshot "+snapshot.name());
			workingtime.child(""+snapshot.val().idwt).startAt(employee).endAt(employee).once("value",function(snap){
				console.log("snap "+JSON.stringify(snap.val()));
				if(snap.val()){
					if(snap.val().checkout == ""){
						doCheckout(snap.val());

					}
					*/
					if(!flag){
						console.log("para checkin "+employee);
						doCheckin(employee);
					}
				}else{
					doCheckin(employee);

				}
			});
		
	};
