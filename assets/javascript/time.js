$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyB5hW0shbMUtRck8UBJUilplYUaHLq37nk",
        authDomain: "firstfirebaseproject-91b60.firebaseapp.com",
        databaseURL: "https://firstfirebaseproject-91b60.firebaseio.com",
        projectId: "firstfirebaseproject-91b60",
        storageBucket: "",
        messagingSenderId: "618327565931",
        appId: "1:618327565931:web:402f936ce688c6b0"
      };
      firebase.initializeApp(firebaseConfig);

    var dataRef = firebase.database();

    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function() {
        event.preventDefault();

        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        console.log(name);
        console.log(destination);
        console.log(firstTrain);
        console.log(frequency);

        dataRef.ref().push({
            name:name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    dataRef.ref().on("child-added", function(childSnapshot){

      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().firstTrain);
      console.log(childSnapshot.val().frequency);

        var minAway;
        var firstTrainNew = moment(childSnapshot.val().firstTrain,"HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +"</td><td>" + childSnapshot.val().destination +
        "</td><td>" + childSnapshot.val().frequency +
        "</td><td>" + nextTrain + 
        "</td><td>" + minAway + "</td></tr>")

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
});

dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    $("#train-name").html(snapshot.val().name);
    $("#destination").html(snapshot.val().destination);
    $("#frequency").html(snapshot.val().frequency);
    $("#first-train").html(snapshot.val().firstTrain)
    });


});