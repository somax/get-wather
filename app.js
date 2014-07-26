var http = require("http");
var cheerio = require("cheerio");

//端口定义
var port = 6600;



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

/**
 * 清理前后空格
 * @return {[type]} [description]
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 *
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
function createServerHandle(request, response) {

	var _url =  request.url

	console.log('\n\n\n\n request!!!!', _url)
	if (_url === '/') {


		// response.writeHead(200, {"Content-Type": "text/plain"});
		response.writeHead(200, {
			"Content-Type": "application/json; charset=utf-8"
		});


		//输出对象
		var output = {
			wather: {},
			forecast: []
		};


		/**
		 * getWather 获取天气数据
		 * @param  {String} url 网页地址
		 */
		function getWather(url) {
			// var url = "http://www.weather.com.cn/html/weather/101020100.shtml"
			download(url, parseWatherHtml)
		}


		/**
		 * parseWatherHtml 解析网页数据
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		function parseWatherHtml(data) {
			if (data) {
				//console.log(data);

				var $ = cheerio.load(data);
				//todo 
				// var items = ['date', 'dayOrNight', 'img', 'w', 'temp', 'wing', 'lev'];
				var items = 'date dayOrNight img w temp wing lev night night-img night-w night-temp night-wing night-lev'.split(' ');
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

				console.log("\n\n\n\ndone!!", output);

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

	}else if(_url=='/other'){
		//todo 
	}


}


//启动服务
http.createServer(createServerHandle).listen(port);

console.log('server on :', port)