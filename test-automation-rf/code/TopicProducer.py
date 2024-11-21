"""
    TopicProducer.py : contains methods to produce messages to kafka topic
"""
from confluent_kafka import Producer
from robot.libraries.BuiltIn import BuiltIn
from collections import OrderedDict

import robot.libraries
import KafkaUtil

kafka_params = KafkaUtil.get_kafka_params()
bootstrap_servers = kafka_params.get('bootstrap_servers')
response_topic = kafka_params.get('response_topic')

def push_message_to_topic(message):
    """Kafka Producer to send the response as json message and push it"""
    global bootstrap_servers
    global response_topic
    p = Producer({"bootstrap.servers": bootstrap_servers})
    p.produce(response_topic, str(message).encode("utf-8"), callback=delivery_report)
    p.flush()
    return delivery_report

def delivery_report(err, msg):
    if err is not None:
        print("Message delivery failed: {}".format(err))
    else:
        print("Message delivered to {} [{}]".format(msg.topic(), msg.partition()))