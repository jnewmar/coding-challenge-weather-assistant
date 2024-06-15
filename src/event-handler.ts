// src/event-handler.ts

import { EventEmitter } from 'events';
import { OpenAI } from 'openai';
import { WeatherService } from './weather/weather-service';
import { RunSubmitToolOutputsAndPollParams } from 'openai/resources/beta/threads/runs/runs';
import { LocationNotFoundError, WeatherProviderError } from './errors';

export default class EventHandler extends EventEmitter {
  openai: OpenAI;

  constructor(openai: OpenAI) {
    super();
    this.openai = openai;
  }

  async onEvent(event: any) {
    //console.log(event.event, event.data?.content)
    try {
      if (event.event === 'thread.message.completed') {
        this.emit('response', event.data.content[0].text.value);
      }
      if (event.event === 'thread.run.requires_action') {
        await this.handleRequiresAction(
          event.data,
          event.data.id,
          event.data.thread_id,
        );
      }
      if (event.event === 'thread.run.completed') {
        this.emit('completed');
      }
    } catch (error) {
      console.error('Error handling event:', error);
    }
  }

  async handleRequiresAction(data: any, runId: any, threadId: any) {
    try {
      const toolOutputs = [];

      for (const toolCall of data.required_action.submit_tool_outputs
        .tool_calls) {
        if (toolCall.function.name === 'get_weather') {
          const weatherService = new WeatherService();
          const functionArgs = JSON.parse(toolCall.function.arguments);
          if (!functionArgs.city) {
            console.error('City not informed or not identified');
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: `Location not found: City not informed or not identified`,
            });
          } else {
            try {
              const output = await weatherService.shouldIGoOutside(
                functionArgs.city,
                functionArgs.state,
                functionArgs.country,
              );

              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify(output),
              });
            } catch (error) {
              console.log(error);
              if (error instanceof LocationNotFoundError) {
                console.error('Location not found:', error.message);
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: `Location not found: ${error.message}`,
                });
              } else if (error instanceof WeatherProviderError) {
                console.error('Weather provider error:', error.message);
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: `Weather provider error: ${error.message}`,
                });
              } else {
                console.error('Unexpected error:', error);
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: 'An unexpected error occurred. Please try again.',
                });
              }
            }
          }
        }
      }
      if (toolOutputs.length > 0) {
        await this.submitToolOutputs(toolOutputs, runId, threadId);
      }
    } catch (error) {
      console.error('Error processing required action:', error);
    }
  }

  async submitToolOutputs(
    toolOutputs: RunSubmitToolOutputsAndPollParams.ToolOutput[],
    runId: string,
    threadId: string,
  ) {
    try {
      const stream = this.openai.beta.threads.runs.submitToolOutputsStream(
        threadId,
        runId,
        { tool_outputs: toolOutputs } as RunSubmitToolOutputsAndPollParams,
      );
      for await (const event of stream) {
        this.emit('event', event);
      }
    } catch (error) {
      console.error('Error submitting tool outputs:', error);
    }
  }
}
