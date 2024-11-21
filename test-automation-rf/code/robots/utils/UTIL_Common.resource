*** Settings ***
Library     RPA.Browser.Playwright
Library     String

*** Keywords ***
Push response message to kafka topic
    [Documentation]    push the response message to kafka topic
    [Tags]    function
    [Arguments]    ${payload_response_msg}
    ${json_response}=    Evaluate    json.dumps(${payload_response_msg})    json
    ${producer_response}=    TopicProducer.Push Message To Topic    ${json_response}
    Log To Console    kafka_producer_response:${producer_response}
    RETURN    ${producer_response}
