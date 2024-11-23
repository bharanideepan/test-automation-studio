
# Setup Steps

## Install Python 3.9 Version

Download Python 3.9 from the official website:
[https://www.python.org/downloads/release/python-370/](https://www.python.org/downloads/release/python-370/)

---

## Install pip

Download pip from:
[https://pypi.org/project/pip/](https://pypi.org/project/pip/)

---

## Install Conda (Anaconda)

Follow the installation guide for Conda:
[https://docs.conda.io/projects/conda/en/latest/user-guide/install/windows.html](https://docs.conda.io/projects/conda/en/latest/user-guide/install/windows.html)

---

## Conda Commands

## Conda Command to Create Environment

```bash
conda create -n env_name python=3.7 anaconda
```


## Conda Command to Activate Environment

```bash
conda activate env_name
```

## Install dependencies

1. poetry install

## Initialize RF Browser

```bash
rfbrowser init
```


## Kafka installation and setup

https://www.geeksforgeeks.org/how-to-install-and-run-apache-kafka-on-windows/

## Create a topic

./kafka-topics.bat --create --topic request_topic --bootstrap-server localhost:9092

./kafka-topics.bat --create --topic response_topic --bootstrap-server localhost:9092

## Start polling

cd code/ source init.sh
