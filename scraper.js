var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var linkscrape = require('linkscrape');

var eventUrls = [];

var categoryNames = ["Beer Culture", "Kids", "Music", "Art", "Festivals & Fairs", "Food & Wine", "Farmer's Markets", "Nature", "Sports", "Tenth Month", "Tours", "Film", "Theater", "Special Events & Galas", "Oregon 150", "Educational", "Fundraiser", "Tower Theatre"];

//*******ideas for improvement****************
//-include photo of each event
//-real time loading of HTML table after user puts in trail area


//creating the event urls for each category

categoryNames.forEach(function(category) {
  var eventUrl =  'http://www.visitbend.com/Bend_Oregon_Activities_Recreation/bend_oregon_events_calendar/?sort1=RecurringDate%2Casc&filter1=RecurringDate%2Cgt%2C20170415&filter2=RecurringDate%2Clt%2C20991231&filter3=IsApproved%2Ceq%2CYes&filter4=Category%2Ceq%2C' + category + '&filterrel=filter1+AND+filter2+AND+filter3+AND+filter4';

  eventUrls.push(eventUrl);
  return true;
});

//function to scrape trail info from each page

function scrapeEventInfo(error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    var eventInfo = [];
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

    // console.log(eventInfo);
    fs.appendFileSync('alleventinfo.txt', eventInfo + '\n');
  };

  return true;
};

// requesting each page and scraping details from each page

function eventDetails(links) {
  links.forEach(function(link) {
    request(link, scrapeEventInfo);
  });
};

// 1. pass in the eventUrls array into the function to give access to all of the links
// 2. for each link in the eventUrls array, request the link, then use the scrapeEventInfo function on that link

return eventDetails(eventUrls);
//working function to scrape event info off particular page and pass details
//into an array

// request('http://www.visitbend.com/Bend_Oregon_Activities_Recreation/bend_oregon_events_calendar/?sort1=RecurringDate%2Casc&filter1=RecurringDate%2Cgt%2C20170415&filter2=RecurringDate%2Clt%2C20991231&filter3=IsApproved%2Ceq%2CYes&filter4=Category%2Ceq%2CSports&filterrel=filter1+AND+filter2+AND+filter3+AND+filter4', function scrapeTrailInfo(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var $ = cheerio.load(body);
//     var eventInfo = [];
//     $('#eventItems .eventItem').each(function(i, element){
//       var h3 = $(this).find('h3');
//       eventName = $(h3).text().trim();
//       // console.log("Event Name: ", eventName);
//       eventInfo.push(eventName);
//
//       var div1 = $(this).find('div .eventDate');
//       eventDateTime = $(div1).text().trim();
//       // console.log("Date/Time: ", eventDateTime);
//       eventInfo.push(eventDateTime);
//
//       var span1 = $(this).find('div .eventLocation .Location');
//       location = $(span1).text().trim();
//       eventInfo.push(location);
//
//       var span2 = $(this).find('div .eventLocation .LocationAddress1');
//       locationAddress1 = $(span2).text().trim();
//       eventInfo.push(locationAddress1);
//
//       var span3 = $(this).find('div .eventLocation .LocationCity');
//       locationCity = $(span3).text().trim();
//       eventInfo.push(locationCity);
//
//       var span4 = $(this).find('div .eventLocation .LocationState');
//       locationState = $(span4).text().trim();
//       eventInfo.push(locationState);
//
//       var span5 = $(this).find('div .eventLocation .LocationZip');
//       locationZip = $(span5).text().trim();
//       eventInfo.push(locationZip);
//
//       var span6 = $(this).find('div .eventLocation .LocationPhone');
//       locationPhone = $(span6).text().trim();
//       eventInfo.push(locationPhone);
//
//       var div2 = $(this).find('.eventLocation ~ div');
//       description = $(div2).text().trim();
//       // console.log("Description: ", description);
//       eventInfo.push(description + "\r" + "\r");
//
//       // var eventObjects = {
//       //   eventName: eventName,
//       //   eventDateTime: eventDateTime,
//       //   location: location,
//       //   locationAddress1,
//       //   locationCity,
//       //   locationState,
//       //   locationZip,
//       //   locationPhone,
//       //   description
//       // };
//
//       // eventInfo.push(eventObjects);
//     });
//
//     console.log(eventInfo);
//     fs.appendFileSync('eventinfo.txt', eventInfo + '\n');
//   };
// });
