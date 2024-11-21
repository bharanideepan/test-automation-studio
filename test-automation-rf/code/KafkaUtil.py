"""
    KafkaUtil.py : Utility methods for accessing the Kafka Cluster
"""
from confluent_kafka import Producer
from confluent_kafka import Consumer
from confluent_kafka.admin import AdminClient
import os
from robot.libraries.BuiltIn import BuiltIn
import jsonschema
import json

running = True


def get_kafka_params():
    bootstrap_servers = 'localhost:9092'
    consumer_group_id = 'test-automation-rf'
    offset_reset = 'earliest'
    request_topic = 'request_topic'
    response_topic = 'response_topic'
    return {
        'bootstrap_servers': bootstrap_servers,
        'consumer_group_id': consumer_group_id,
        'offset_reset_policy': offset_reset,
        'request_topic': request_topic,
        'response_topic':  response_topic 
    }
