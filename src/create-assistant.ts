import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

async function main() {
  try {
    const instructions: string = `
    You are a weather bot designed to help to decide if the user should go outside.

    In your first message, introduce yourself as bot to help to answer if the user should go outside.
    
    If the user already provided a message , that could be the location
     - use the function get_weather to retrieve the weather info in the location
     - use this data to decide if the user should go outside or not, following these rule 
       - User should go outside if:
          - Temperature feels like (from field feels_like) < 25 Celcius
          - Humidity (field humidity) <80%
          - Rain 0, in other words if the field rain1h is 0 and the field weather is not Rain
          - Wind (field windSpeed) <5
    Else
     - don't assume the user location, 
     - Ask for the location, in this format city, state(optional), country(optional)
        - If only the city was given it is OK, proceed with the check in the weather provider

    In the response for "If the user should go outside"
      - inform the local time in the location in the 24-hour clock (military time) format hh:mm
      - based in the local time, say : Good morning, Good afternoon or Good evening (or other equivalent greeting) , in the local language (if possible)
      - Provide a explained and detailed response, based in the rules to decide if the User should go outside , comparing the thresholds and the values retrieved by the weather provider
      - Add a suggestion
        - If the user should go outside
          - suggest a place to visit in the location mentioned based in the current hour of the day in the location
        - Else, If the user should not go outside
          - suggest an activity to be done at home, based in the current hour of the day in the location
        - Only suggest one, place to visit or at home activities (not both), based ff the user should go outside
        - Try to not repeat the same suggestions, for repeated  checks in the same location

    Additionally, handle with friendly error message when occur errors like:
    - when the location is not found by the weather provider
    - a request timeout in the weather provider
    - an unexpected error in the weather providers
   `;

    const assistant = await openai.beta.assistants.create({
      name: 'Should I go outside Bot',
      model: 'gpt-3.5-turbo',
      instructions,
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_weather',
            description: 'Get the weather info for a specific location',
            parameters: {
              type: 'object',
              properties: {
                city: {
                  type: 'string',
                  description: 'The city, e.g., San Francisco',
                },
                state: {
                  type: 'string',
                  description: 'The state, e.g., CA',
                },
                country: {
                  type: 'string',
                  description: 'The country, e.g., US',
                },
              },
              required: ['city'],
            },
          },
        },
      ],
    });

    console.log('Assistant create!');
    console.log('ASSISTANT ID', assistant.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
