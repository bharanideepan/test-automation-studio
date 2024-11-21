"""
    CommandConsumer.py : contains methods to poll messages from kafka topic
"""
from confluent_kafka import Producer
from confluent_kafka import Consumer
from robot.libraries.BuiltIn import BuiltIn
from collections import OrderedDict
import TopicProducer
import jsonschema

import json
import TopicProducer
import KafkaUtil


running = True
kafka_params = KafkaUtil.get_kafka_params()
bootstrap_servers = kafka_params.get('bootstrap_servers')
consumer_group_id = kafka_params.get('consumer_group_id')
offset_reset = kafka_params.get('offset_reset_policy')
request_topic = kafka_params.get('request_topic')


""" Kafka Consumer to receive the json message and process it """
consumer_conf = {
    "bootstrap.servers": bootstrap_servers,
    "group.id": consumer_group_id,
    "auto.offset.reset": offset_reset,
}

def consumer_loop(consumer, topics):
    global running
    try:
        consumer.subscribe(topics)
        while running:
            # msg = consumer.poll(timeout=int(max_timeout))
            msg = consumer.poll()
            if msg is None or msg == 'None':
                continue
            if msg.error():
                print(msg.error())
                continue
            else:
                """once the message is processed , stop the kafka consumer"""
                try:
                    data = json.loads(msg.value().decode("utf-8"))
                    BuiltIn().log_to_console('Received message: ')
                    BuiltIn().log_to_console('json_obj : ' + str(type(data)))
                    return data
                except (jsonschema.ValidationError, jsonschema.SchemaError) as e:
                    TopicProducer.send_invalid_request_error_response_to_kafka(
                        data, e)
    except Exception as e:
        print(str(e))
    finally:
        consumer.close()


def get_a_command(max_timeout):
    global request_topic
    consumer = Consumer(consumer_conf)
    return consumer_loop(consumer, [request_topic])
