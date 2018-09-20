
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const SENDGRID_API_KEY = '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';
const sendgrid = require("sendgrid")(SENDGRID_API_KEY);
const https = require('https');
/*
const sendSingleMail = function () {
	// Send a single mail
	var email = new sendgrid.Email();
	
	console.log('Setting mail...', email);
	email.addTo("giacomo.voltolina@everis.com");
	email.setFrom("bot@innovation.com");
	email.setSubject("Datos usuarios");
	email.setHtml("This email informs that our Systems Area has closed and finalized the action requested through the Ticket. Thank you.");

	console.log('Sending mail...');
	sendgrid.send(email);
	console.log('Mail sent!');
  
  return true;
};
 */
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
 //estan presente aqui pero no he activado el fulfillment para este metodo
  function welcome(agent) {
    const benvenuto = agent.parameters.bienvenidos; 
	agent.add(benvenuto+ `, me gustaria saber cual es tu nombre! 10.48`);

  }
 
 //estan presente aqui pero no he activado el fulfillment para este metodo
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  
  function Email(params) {
  params = params || {};

  this.to      = params.to      || [];
  this.from    = params.from    || '';
  this.smtpapi = params.smtpapi || new smtpapi_lib();
  this.subject = params.subject || '';
  this.text    = params.text    || '';
  this.html    = params.html    || '';
  this.bcc     = params.bcc     || [];
  this.cc      = params.cc      || [];
  this.replyto = params.replyto || '';
  this.date    = params.date    || '';
  this.headers = params.headers || {};

  if(params.toname !== null) {
    this.toname = params.toname;
  }
  if(params.fromname !== null) {
    this.fromname = params.fromname;
  }
  // auto handle calling the constructor for the file handler
  this.files = [];
  if (params.files) {
    params.files.forEach(function(file) {
      this.files.push(new FileHandler(file));
    }, this);
  }
}
  
 Email.prototype.addTo = function(to) {
  this.smtpapi.addTo(to);
  return this;
}; 
 
Email.prototype.setFrom = function(from) {
  this.from = from;
  return this;
};

Email.prototype.setSubject = function(subject) {
  this.subject = subject;
  return this;
}; 

Email.prototype.setHtml = function(html) {
  this.html = html;
  return this;
}; 
 
  //estan presente aqui pero no he activado el fulfillment para este metodo
   function recojer(agent) {
	
	
	// send mail!
	//sendSingleMail();
	
	const Email = {
			   to:[
                    {
                      "email": "giacomo.voltolina@everis.com",
                      "name": "giacomo voltolina"
                    }
                  ],
			  from: 'NoticeService@service.com',
			  subject: 'Notification meeting',
			  text: '',
			  html: 'Sorry, I am late. On my way!',
			  bcc: [],
			  cc: [],
			  replyto: '',
			  date: '',
			  headers: {},
			  toname: undefined,
			  fromname: undefined,
			  files: [] 
	};
	
	var email = new sendgrid.Email();
	
	console.log('Setting mail...', email);
	//email.addTo("giacomo.voltolina@everis.com");
	//email.setFrom("NoticeService@service.com");
	//email.setSubject("Notification meeting");
	//email.setHtml("Sorry, I'm late. On my way!");

	console.log('Sending mail...');
	//sendgrid.send(email);
	console.log('Mail sent!');
	
	console.log('VEDIAMO SE FA LA CHIAMATA API');
	var YQL = require('yql');
    var city = 'Rome';
    var query = new YQL("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text= '"+ city+"')");
    
    query.exec(function(err, data) {
      var location = data.query.results.channel.location;
      var condition = data.query.results.channel.item.condition;
      
      console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
    });
	console.log('FINITO METODO DELLA CHIAMATA API 10.46');
	
	const name = agent.parameters.nombre;
	const mail = agent.parameters.email;
	const texto = agent.parameters.text;
	agent.add(` perfecto, hemos recojido tus datos. ciao `+name+' '+mail+' '+texto);
	
  }
  
  

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('recojer-datos', recojer);
  
  // intentMap.set('your intent name here', yourFunctionHandler);
  agent.handleRequest(intentMap);
});
