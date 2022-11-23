'use strict';

const {Engine} = require('./index.js');
const fs = require('fs');

// encounter "callback is not a function error"
async function postMessage(scope, callback) {
  let result = 'mock result'
  console.log('call postMessage')

  try {
  } catch (err) {
    // return callback(null, err);
  }

  // return callback(null, result);
}


const source = fs.readFileSync('./test/resources/service-task.bpmn')

const engine = new Engine({
  name: 'service task example 1',
  source,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  },
  extensions: {
    saveToResultVariable(activity) {
      if (!activity.behaviour.resultVariable) return;

      activity.on('end', ({environment, content}) => {
        environment.output[activity.behaviour.resultVariable] = content.output[0];
      });
    },
  }
});

engine.execute({

  services: {
    postMessage,
  }
}, (err, execution) => {
  if (err) throw err;

  console.log('Service task output:', execution.environment.output.serviceResult);
});