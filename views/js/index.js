var x = document.getElementById("demo");
var y = document.getElementById("y");

		function getLocation() {
		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(showPosition, showError);
		    } else { 
		        x.innerHTML = "Geolocation is not supported by this browser.";
		    }
		}

		function showPosition(position) {
		    $("#demo").val(position.coords.latitude + 
		    "," + position.coords.longitude);  
		}

		function showError(error) {
		    switch(error.code) {
		        case error.PERMISSION_DENIED:
		            x.innerHTML = "User denied the request for Geolocation."
		            break;
		        case error.POSITION_UNAVAILABLE:
		            x.innerHTML = "Location information is unavailable."
		            break;
		        case error.TIMEOUT:
		            x.innerHTML = "The request to get user location timed out."
		            break;
		        case error.UNKNOWN_ERROR:
		            x.innerHTML = "An unknown error occurred."
		            break;
		    }
		}

		function initMap() {
		  
		}

		$("#gps").click(function(){
			var geocoder = new google.maps.Geocoder;
			var input = $("#demo").val();
			var latlngStr = input.split(',', 2);
 			var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
			geocoder.geocode({'location': latlng}, function(results, status) {
			y.innerHTML = results[0].formatted_address;
			});
		});