require('dotenv').config()

const _ = require('lodash');

const reqClient = require('./utils/axios')

const Scheduler = require('./controllers/scheduler')

; (async () => {
    const dataset = await reqClient.get(`/candidateTest/v3/problem/dataset?userKey=${process.env.ACCESS_TOKEN}`);

    const { partners } = dataset

    const countries = {};

    partners.forEach(partner => {
        if (!countries[partner.country]) {
            countries[partner.country] = new Scheduler();
        }
        partner.availableDates.forEach(date => countries[partner.country].pushToArray(partner.email, date))
    })
    
    invitationPostData = {
        countries: []
    }

    Object.keys(countries).forEach(country => {
        var bestDate = countries[country].getBestDate()
        if (bestDate) bestDate = bestDate.format("YYYY-MM-DD");
        let attendees = countries[country].getAttendeesForDate(bestDate) || [];
        countryPostData = {
            attendeeCount: attendees.length,
            attendees,
            name: country,
            startDate: bestDate
        }

        invitationPostData.countries.push(countryPostData)
    });

    const result = await reqClient.post(`/candidateTest/v3/problem/result?userKey=${process.env.ACCESS_TOKEN}`, invitationPostData);

    console.log(result)
})()