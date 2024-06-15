# Weather Assistant Chatbot

This project is a headless backend service to power a chatbot that tells you if you should go outside today based on the weather conditions in your location. It integrates with OpenAI's assistant and OpenWeather API to provide the necessary information.

## Prerequisites

- Node.js (version 18)
- npm (version 10)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jnewmar/coding-challenge-weather-assistant.git
cd coding-challenge-weather-assistant
```

2. Install the dependencies:

```bash
npm install
```

3. Copy the `.env.sample` file to `.env` and fill in the necessary API keys and configuration:

```bash
cp .env.sample .env
```

## Environment Variables

The `.env` file should contain the following variables:

| Variable Name           | Description                                                                                  |
|-------------------------|----------------------------------------------------------------------------------------------|
| `OPENAI_API_KEY`        | Your API key for OpenAI. This is required to authenticate requests to OpenAI's API.          |
| `OPENAI_MAX_RETRIES`    | The maximum number of retry attempts for OpenAI API requests in case of failure.             |
| `OPENAI_TIMEOUT`        | The timeout in milliseconds for OpenAI API requests.                                         |
| `ASSISTANT_ID`          | The ID of the assistant created in OpenAI's platform.                                        |
| `OPENWEATHER_API_KEY`   | Your API key for OpenWeather. This is required to authenticate requests to OpenWeather's API.|
| `OPENWEATHER_TIMEOUT`   | The timeout in milliseconds for OpenWeather API requests.                                    |
| `WEATHER_PROVIDER_TYPE` | The type of weather provider to use (e.g., `openweather`).                                   |
| `DEBUG`                 | Enable or disable debug mode for the OpenAi (`true` or `false`).                             |
| `PORT`                  | The port number for the Express server to listen on.                                         |
| `WS_PORT`               | The port number for the WebSocket server to listen on.                                       |
| `MAX_FEELS_LIKE`        | The maximum temperature in Celsius for a recommendation to go outside. <br>(Not in use, Only for the alternative method where the should go outside is analyzed in the code)|
| `MAX_HUMIDITY`          | The maximum humidity percentage for a recommendation to go outside. <br>(Not in use, Only for the alternative method where the should go outside is analyzed in the code)|
| `MAX_RAIN`              | The maximum amount of rain (in mm) for a recommendation to go outside. <br>(Not in use, Only for the alternative method where the should go outside is analyzed in the code)|
| `MAX_WIND_SPEED`        | The maximum wind speed (in m/s) for a recommendation to go outside. <br>(Not in use, Only for the alternative method where the should go outside is analyzed in the code)|


## Scripts

### Start Express Endpoint

To start the Express endpoint for the chatbot, run:

```bash
npm run start
```

This will run the server on the port specified in the `.env` file (default is 3000).

### WebSocket Version

To run the WebSocket version of the chatbot, run:

```bash
npm run ws
```

This will run the WebSocket server on the port specified in the `.env` file (default is 3001).

### Create Assistant

To create the assistant using OpenAI's API, run:

```bash
npm run create-assistant
```

## Usage

### Express Endpoint

Send a POST request to `/chat` with a JSON body containing a `message` field to interact with the chatbot. For example:

```bash
curl -X POST http://localhost:3000/chat -H "Content-Type: application/json" -d '{"message": "Should I go outside today?"}'
```

### WebSocket

Connect to the WebSocket server at `ws://localhost:3001` and send messages to interact with the chatbot.

## Project Structure

- `src/index.ts`: Entry point for the Express server.
- `src/ws.ts`: Entry point for the WebSocket server.
- `src/create-assistant.ts`: Script to create the assistant using OpenAI's API.
- `src/event-handler.ts`: Event handler for managing OpenAI events.
- `src/weather-provider-factory.ts`: Factory for creating weather provider clients.
- `src/openweather-client.ts`: Implementation of the weather provider client using the OpenWeather API.
- `src/weather-service.ts`: Service for determining if you should go outside based on weather conditions.
- `src/config/weatherServiceConfig.ts`: Configuration for weather service rules.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## Acknowledgements

- [OpenAI](https://platform.openai.com) for their assistant API.
- [OpenWeather](https://openweathermap.org) for their weather API.
- [OpenWeather Endpoint to get weather info based in the location](https://openweathermap.org/current#name)

