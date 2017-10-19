$(document).ready(function() {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCT0d8Wy8DXcIsYQp3hvc22dmz2GDuCZqU",
		authDomain: "campbase-c64d6.firebaseapp.com",
		databaseURL: "https://campbase-c64d6.firebaseio.com",
		projectId: "campbase-c64d6",
		storageBucket: "",
		messagingSenderId: "343604388573"
	};

	firebase.initializeApp(config);

	var database = firebase.database();

	database.ref("/TrainSchedule").on("value", function(snap) {
		$("#display-schedule").empty();

		var currentTime = moment();
		$("#curtime").text("(" + currentTime.format("hh:mm A") + ")");		

		snap.forEach(function(childsnap) {
			var info = childsnap.val();

			var tr = $("<tr>");
			tr.append("<td>" + info.trainName + "</td>");
			tr.append("<td>" + info.destination + "</td>");
			tr.append("<td>" + info.frequency + "</td>");

			var firstTimeConverted = moment(info.firstTime, "hh:mm").subtract(1, "years");
			var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
			var tRemainder = diffTime % info.frequency;
			var tMinutesTillTrain = info.frequency - tRemainder;
			var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");

			if(diffTime >= 0) {
				tr.append("<td>" + moment(nextTrain).format("hh:mm A") + "</td>");
				tr.append("<td>" + tMinutesTillTrain + "</td>");
			}
			else {
				tr.append("<td>N/A</td>");
				tr.append("<td>N/A</td>");
			}
			
			$("#display-schedule").append(tr);
		});
	});

	$("#select-schedule").on("click", function(event) {
		// prevent form from submitting
		event.preventDefault();

		var name = $("#data-name").val().trim();
		var dest = $("#data-dest").val().trim();
		var ftime = $("#data-ftime").val().trim();
		var freq = $("#data-freq").val().trim();

		database.ref("/TrainSchedule").push({
			trainName: name,
			destination: dest,
			firstTime: ftime,
			frequency: freq
		});

		$("#data-name").val("");
		$("#data-dest").val("");
		$("#data-ftime").val("");
		$("#data-freq").val("");
	});

	// database.ref("/TrainSchedule").set({});	// clear data in Firebase
});

