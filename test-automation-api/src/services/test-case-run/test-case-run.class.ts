import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { Kafka } from "kafkajs";

const clientId = "test-automation-rf";
const brokers = ["localhost:9092"];
const commandTopic = "request_topic";
const eventTopic = "response_topic";

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: clientId });

export class TestCaseRun extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
    this.initKafka();
  }

  async execute(data: any, params: any) {
    try {
      let { testCaseId } = data as any;
      const testCaseRun = await this.app.service('test-case-run').create({
        testCaseId,
        status: "ADDED_TO_QUEUE"
      });
      const testCase = await this.app.service('test-case').getExecutableTestCaseData(testCaseId, params);
      const message = { type: 'START_RUN', payload: { testCaseRun, testCase } };
      // if (this.app.io) {
      //   console.log("IO exists")
      //   this.app.io?.emit(`testCaseRunUpdates:26`, { status: "success" });
      // }
      await this.sendMessage(commandTopic, message);
      // this.consume();
      return testCaseRun;
    } catch (err) {
      throw new Error(`Error while creating test-case-data: ${err}`);
    }
  }

  async sendMessage(topic: string, messages: any) {
    try {
      await producer.send({ topic, messages: [{ value: JSON.stringify(messages) }] });
      console.log({ message: "Message sent to topic: ", topic, messages });
    } catch (err) {
      console.error("Could not write message " + err);
    }
  }

  async consume() {
    await consumer.subscribe({ topic: eventTopic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("Response from RPA received.");
        if (message.value) {
          const response = JSON.parse(message.value.toString("utf8"));
          if (response.flowActionSequenceId) {
            const { testCaseRunId, flowActionSequenceId, status, errorMessage } = response;
            this.app.service('flow-action-sequence-history').create({
              testCaseRunId,
              flowActionSequenceId,
              status,
              errorMessage
            })
          } else if (response.testCaseFlowSequenceId) {
            const { testCaseRunId, testCaseFlowSequenceId, status, errorMessage } = response;
            this.app.service('test-case-flow-sequence-history').create({
              testCaseRunId,
              testCaseFlowSequenceId,
              status,
              errorMessage
            })
          } else {
            const { testCaseRunId, status, errorMessage } = response;
            this.app.service('test-case-run').patch(testCaseRunId, {
              status,
              errorMessage
            })
          }
          // Send real-time updates to the front-end
          // this.app.io.emit('test-case-run-updates', { testCaseRunId, status, message: updateMessage });
        }
      },
    });
  }

  async initKafka() {
    try {
      await producer.connect();
      await consumer.connect();
      console.log("Kafka producer and consumer connected.");
      this.consume();
    } catch (err) {
      console.error("Error initializing Kafka:", err);
    }
  }

  async teardownKafka() {
    await producer.disconnect();
    await consumer.disconnect();
    console.log("Kafka producer and consumer disconnected.");
  }
}
