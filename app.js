var http = require("http");
var cheerio = require("cheerio");

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			return callback(data);
		});
	}).on("error", function() {
		return callback(null);
	});
}

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

var port = 6600;


http.createServer(function(request, response) {

// response.writeHead(200, {"Content-Type": "text/plain"});
response.writeHead(200, {
	"Content-Type": "application/json; charset=utf-8"
});
// response.write("Welcome to Node.js!");


var output = {
	wather: {},
	forecast: []
};

function getWather(url) {
	// var url = "http://www.weather.com.cn/html/weather/101020100.shtml"

	download(url, parseWatherHtml)
}



function parseWatherHtml(data) {
	if (data) {
		//console.log(data);

		var $ = cheerio.load(data);
		//todo 
		var items = ['date', 'dayOrNight', 'img', 'w', 'temp', 'wing', 'lev'];
		$('.yuBaoTable').each(function() {
			// console.log('======');
			var oneDay = {};
			$(this).find('td').each(function(i, e) {
				$this = $(this);
				var img = $this.find('img').attr('src');

				var text = $this.text().trim()
				// if(img){
				// console.log('>>>>',img||'' + text);
				oneDay[items[i]] = img || '' + text;
			});
			output.forecast.push(oneDay);

		})

		console.log("done", output);

		// return output;



		// response.write(JSON.stringify());


	} else {
		console.log("error");
		// output.forecast = {
		// 	"status": "error"
		// };



	}

	response.write(JSON.stringify(output));

	response.end();

}


getWather("http://www.weather.com.cn/html/weather/101020100.shtml");

}).listen(port);

console.log('server on :',port)