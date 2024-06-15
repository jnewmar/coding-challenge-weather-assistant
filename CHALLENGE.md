# Coding Challenge: “Should I go outside today?” Chatbot

## Objective:

Your job is to create a headless backend endpoint to power a chatbot leveraging OpenAI Assistants’s Function Calling. 
 - Ask user where they are (City, Country)
 - Use function calling to query OpenWeatherAPI
 - Tell the user if they should go outside or not and why

User should go outside if:

 - Temperature feels like <25 Celcius
 - Humidity <80%
 - Rain 0
 - Wind <5
 
 - Time: 120 minutes - 180 minutes

Instructions: 
 
Set up a free account with OpenAI (you might have to use a VPN):http://platform.openai.com (1-2 mins)

Create API Key and navigate to Assistant and set up your first assistant (5 mins)

Read OpenAI Assistant Function Calling document (15 mins): https://platform.openai.com/docs/assistants/tools/function-calling/quickstart

Set up an Assistant endpoint on your local machine using NodeJs: https://platform.openai.com/docs/quickstart (20 mins) 

Develop a function to get weather from OpenWeatherAPI (1hour)
   OpenWeatherAPI doc: https://home.openweathermap.org/api_keys
   OpenWeatherAPI key: xxxxxxxxxxxxxxxxxxxxxx

Wrap everything inside an end point /chat so that a FE engineer can use. 


Deliverables:

Source Code:
  A GitHub repository with the complete source code.
  A <3 minute video using Loom or other recording platform:
  Walk us through your OpenAI Assistant setup on platform.openai.com

Simulate interaction with the /chat from your local machine in the terminal
Please do not use a UI boilerplate because this challenge is about creating a headless BE service. 


Bonus Points:

Error handling, timeout handling, and other edge cases
Flexible: could be reused to accommodate other FE cases
Be creative 
Creativity: Any additional features or enhancements beyond the basic requirements.
Submission:
Email us as soon as you finish with deliverables
