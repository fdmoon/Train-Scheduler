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

	// When data in TrainSchedule is changed
	database.ref("/TrainSchedule").on("value", function(snap) {
		// Clear table
		$("#display-schedule").empty();

		// Get current data
		var currentTime = moment();
		$("#curtime").text("(" + currentTime.format("hh:mm A") + ")");		

		// Add data to table
		snap.forEach(function(childsnap) {
			var info = childsnap.val();

			var tr = $("<tr>");
			tr.attr("key", childsnap.key);
			tr.append("<td>" + info.trainName + "</td>");
			tr.append("<td>" + info.destination + "</td>");
			tr.append("<td>" + info.frequency + "</td>");

			// Calculate time using moment.js
			var firstTimeConverted = moment(info.firstTime, "hh:mm").subtract(1, "years");
			var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
			var tRemainder = diffTime % info.frequency;
			var tMinutesTillTrain = info.frequency - tRemainder;
			var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");

			tr.append("<td>" + moment(nextTrain).format("hh:mm A") + "</td>");
			tr.append("<td>" + tMinutesTillTrain + "</td>");
			
			$("#display-schedule").append(tr);
		});
	});

	// When submit button is clicked
	$("#select-schedule").on("click", function(event) {
		// prevent form from submitting
		event.preventDefault();

		// Retrieve data
		var name = $("#data-name").val().trim();
		var dest = $("#data-dest").val().trim();
		var ftime = $("#data-ftime").val().trim();
		var freq = $("#data-freq").val().trim();

		// Add data to Firebase
		database.ref("/TrainSchedule").push({
			trainName: name,
			destination: dest,
			firstTime: ftime,
			frequency: freq
		});

		// Clear each field
		$("#data-name").val("");
		$("#data-dest").val("");
		$("#data-ftime").val("");
		$("#data-freq").val("");
	});

	// When a row in table is clicked
	$(document).on("click", "tbody tr", function() {
		// Display data of selected row
		database.ref("/TrainSchedule/" + $(this).attr("key")).on("value", function(snap) {
			$("#data-name").val(snap.val().trainName);
			$("#data-dest").val(snap.val().destination);
			$("#data-ftime").val(snap.val().firstTime);
			$("#data-freq").val(snap.val().frequency);
		});
	});

	// database.ref("/TrainSchedule").set({});	// clear data in Firebase
});

