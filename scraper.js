var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var linkscrape = require('linkscrape');

var arrayTrailUrls = [];

//*******ideas for improvement****************
//-include absolute path/href for each trail so user can click on the trail
//-include photo of each trail
//-include relative area within county the trail is located (if info is available)
//-include elevation change as single number
//-allow user to put in the trail area (e.g Deschutes National Forest URL) and scrape those trail Urls
//-real time loading of HTML table after user puts in trail area


//working function to scrape trail details off particular page and pass details
//into an array

request('http://www.visitbend.com/Bend_Oregon_Activities_Recreation/bend_oregon_events_calendar/?sort1=RecurringDate%2Casc&filter1=RecurringDate%2Cgt%2C20170415&filter2=RecurringDate%2Clt%2C20991231&filter3=IsApproved%2Ceq%2CYes&filter4=Category%2Ceq%2CSports&filterrel=filter1+AND+filter2+AND+filter3+AND+filter4', function scrapeTrailInfo(error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    var eventInfo = [];
    var eventName = [];
    var trailDetails = [];
    $('#eventItems .eventItem').each(function(i, element){
      var h3 = $(this).find('h3');
      eventName = $(h3).text().trim();
      // console.log("Event Name: ", eventName);
      eventInfo.push(eventName);

      var div1 = $(this).find('div .eventDate');
      eventDateTime = $(div1).text().trim();
      // console.log("Date/Time: ", eventDateTime);
      eventInfo.push(eventDateTime);

      var span1 = $(this).find('div .eventLocation .Location');
      location = $(span1).text().trim();
      eventInfo.push(location);

      var span2 = $(this).find('div .eventLocation .LocationAddress1');
      locationAddress1 = $(span2).text().trim();
      eventInfo.push(locationAddress1);

      var span3 = $(this).find('div .eventLocation .LocationCity');
      locationCity = $(span3).text().trim();
      eventInfo.push(locationCity);

      var span4 = $(this).find('div .eventLocation .LocationState');
      locationState = $(span4).text().trim();
      eventInfo.push(locationState);

      var span5 = $(this).find('div .eventLocation .LocationZip');
      locationZip = $(span5).text().trim();
      eventInfo.push(locationZip);

      var span6 = $(this).find('div .eventLocation .LocationPhone');
      locationPhone = $(span6).text().trim();
      eventInfo.push(locationPhone);

      var div2 = $(this).find('.eventLocation ~ div');
      description = $(div2).text().trim();
      // console.log("Description: ", description);
      eventInfo.push(description + "\r" + "\r");

      // var eventObjects = {
      //   eventName: eventName,
      //   eventDateTime: eventDateTime,
      //   location: location,
      //   locationAddress1,
      //   locationCity,
      //   locationState,
      //   locationZip,
      //   locationPhone,
      //   description
      // };

      // eventInfo.push(eventObjects);
    });

    console.log(eventInfo);
    fs.appendFileSync('eventinfo.txt', eventInfo + '\n');
  };
});


// requesting each page and scraping details from each page

// function trailDetails(arrayTrailUrls) {
//   arrayTrailUrls.forEach(function(trailsUrls) {
//     request(trailsUrls, scrapeTrailInfo);
//   });
// };

// scraper for each separate trail
// function scrapeTrailInfo(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var $ = cheerio.load(body);
//     var trailInfo = [];
//     var trailName = [];
//     var trailDetails = [];
//     $('#pagetitletop').each(function(i, element){
//       var div = $(this).find('h1');
//       trailName = $(this).text().trim();
//       trailInfo.push(trailName);
//     });
//     $('#rightcol .themetable .right-box').each(function(i, element){
//       var div = $(this).find('div.box');
//       trailDetails = $(this).text().trim();
//       trailInfo.push(trailDetails);
//     });
//     // trailInfo.push(trailName,trailDetails);
//     console.log(trailInfo);
//     fs.appendFileSync('trailInfo.txt', trailInfo + '\n');
//   };
// };


//passing the relative path names into absolute paths and into an array

// function getURLs(metadataObjects) {
//     arrayTrailUrls = [];
//     metadataObjects.forEach(function(metadata) {
//       var trailsUrls =  'http://www.fs.usda.gov' + metadata.url;
//       // console.log(trailsUrls);
//       arrayTrailUrls.push(trailsUrls);
//     });
//     // console.log(arrayTrailUrls);
//     trailDetails(arrayTrailUrls);
// };


//scraping the category names that filter the event page
//not working yet

// request('http://www.visitbend.com/Bend_Oregon_Activities_Recreation/bend_oregon_events_calendar/', function (error, response, html) {
//     if (!error && response.statusCode == 200) {
//       var $ = cheerio.load(html);
//       var metadataObjects = [];
//       $('#filter4').each(function(i, element){
//         var option = $(this).find('option');
//         console.log("Option: ", option);
//         var category = option.text();
//         console.log("Category: ", category);
//         // var url = a.attr('href');
//         // Our parsed meta data object
//         var metadata = {
//           category: category
//           // url: url
//         };
//         // metadataObjects.push(metadata);
//         // relativePathUrls.push(url);
//         console.log(metadata);
//         // fs.appendFileSync('links.txt', url)
//       });
//       // getURLs(metadataObjects);
//     };
//     // console.log(relativePathUrls);
//     return true;
//   });
