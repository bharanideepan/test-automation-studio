*** Settings ***
Library     Collections
Library     DateTime
Library     Dialogs
Library     OperatingSystem
Library     String
Library     RPA.Browser.Playwright
Library     ../CommandConsumer.py
Library     ./utils/Common_util.py
Resource     ./utils/UTIL_Collection.resource
Resource     ./utils/UTIL_BrowserHelper.resource
Resource     ./utils/UTIL_Common.resource
Resource    ./modules/components/COMP_Button.resource
Resource    ./modules/components/COMP_Textbox.resource
Resource    ./modules/components/COMP_Checkbox.resource
Resource    ./modules/components/COMP_Select.resource
Resource    ./modules/components/COMP_BrowserContext.resource


*** Variables ***
${MAX_TIMEOUT}          10
${TERMINATION_FLAG}     ${False}
${COMMAND_TYPE_START_RUN}     START_RUN
${COMMAND_TYPE_TERMINATE_RUN}     TERMINATE_RUN

${LAUNCH_BROWSER}    LAUNCH_BROWSER
${NEW_PAGE}    NEW_PAGE
${CLICK}    CLICK
${DOUBLE_CLICK}    DOUBLE_CLICK
${GET_DROPDOWN_VALUE}    GET_DROPDOWN_VALUE
${SET_DROPDOWN_VALUE}    SET_DROPDOWN_VALUE
${TYPE_TEXT}    TYPE_TEXT
${GET_TEXTBOX_VALUE}    GET_TEXTBOX_VALUE
${GET_CHECKBOX_VALUE}    GET_CHECKBOX_VALUE
${SET_CHECKBOX_VALUE}    SET_CHECKBOX_VALUE
${GET_RADIO_VALUE}    GET_RADIO_VALUE
${SET_RADIO_VALUE}    SET_RADIO_VALUE
${IS_ELEMENT_VISIBLE}    IS_ELEMENT_VISIBLE
${GET_TEXT}    GET_TEXT


*** Tasks ***
initialize-fb-worker
    execute-functional-block


*** Keywords ***
execute-functional-block
    [Documentation]    To execute fb
    [Tags]    to-initialize-library
    WHILE    '${TERMINATION_FLAG}' == 'False'
        COMP_BrowserContext.launch-browser
        Log To Console    <===Polling message===>
        ${json}=    CommandConsumer.Get A Command    ${5}
        IF    '${json}[type]' == 'KILL'
            BREAK
        END
        TRY
            execute-test-case    ${json}
        EXCEPT    AS    ${error_message}
            Log To Console    ${error_message}
        END
        COMP_BrowserContext.close-browser
    END

execute-test-case
    [Arguments]    ${input}
    Log To Console    Test Case Data=> ${input}
    ${is_type_exists}=    UTIL_Collection.is-value-not-none    ${input}    type
    IF    $is_type_exists == $False
        Log To Console    Type not exists in the input
        RETURN
    END
    IF    '${input}[type]' == '${COMMAND_TYPE_START_RUN}'
        ${is_test_case_exists}=    UTIL_Collection.is-value-not-none    ${input}[payload]    testCase
        ${is_test_case_run_exists}=    UTIL_Collection.is-value-not-none    ${input}[payload]    testCaseRun
        IF    $is_test_case_exists == $False or $is_test_case_run_exists == $False
            Log To Console    Testcase or TestCaseRun data not available in input
        END
        ${testCase}=    Set Variable    ${input}[payload][testCase]
        ${testCaseRun}=    Set Variable    ${input}[payload][testCaseRun]
        Log To Console    Test Case Name: ${testCase}[name]
        TRY
            ${is_test_case_flow_sequences_exists}=    UTIL_Collection.is-value-not-none    ${testCase}    testCaseFlowSequences
            ${test_case_run_response_message}=    Create Dictionary    testCaseRunId=${testCaseRun}[id]    status=STARTED
            UTIL_Common.Push response message to kafka topic    ${test_case_run_response_message}
            IF    $is_test_case_flow_sequences_exists
                FOR    ${testCaseFlowSequence}    IN    @{testCase}[testCaseFlowSequences]
                    TRY
                        ${flow}=    Set Variable    ${testCaseFlowSequence}[flow]
                        Log To Console    Flow Name: ${flow}[name]
                        ${is_flow_action_sequences_exists}=    UTIL_Collection.is-value-not-none    ${flow}    flowActionSequences
                        IF    $is_flow_action_sequences_exists
                            FOR    ${flowActionSequence}    IN    @{flow}[flowActionSequences]
                                TRY
                                    ${action}=    Set Variable    ${flowActionSequence}[action]
                                    Log To Console    Action Name: ${action}[name]
                                    ${input}=    Common_util.Get Selected Input    ${flowActionSequence}
                                    IF    $input == $None
                                        Log To Console    Input not found for this action. Terminate the test case here!!!
                                        EX_Exception.ex-fail    INPUT_NOT_FOUND_IN_ACTION
                                    END
                                    execute-action    ${action}    ${input}
                                    send-action-sequence-message    ${flowActionSequence}[id]    ${testCaseRun}[id]    COMPLETED
                                EXCEPT    AS    ${error_message}
                                    Log To Console    ${error_message}
                                    send-action-sequence-message    ${flowActionSequence}[id]    ${testCaseRun}[id]    FAILED    ${error_message}
                                    EX_Exception.ex-fail    ${error_message}
                                END
                            END
                        END
                        send-flow-sequence-message    ${testCaseFlowSequence}[id]    ${testCaseRun}[id]    COMPLETED
                    EXCEPT    AS    ${error_message}
                        Log To Console    ${error_message}
                        send-flow-sequence-message    ${testCaseFlowSequence}[id]    ${testCaseRun}[id]    FAILED    ${error_message}
                        EX_Exception.ex-fail    ${error_message}
                    END
                END
            END
            send-test-case-run-message    ${testCaseRun}[id]    PASS
        EXCEPT    AS    ${error_message}
            Log To Console    ${error_message}
            send-test-case-run-message    ${testCaseRun}[id]    FAIL    errorMessage=${error_message}
            EX_Exception.ex-fail    ${error_message}
        END
    ELSE
        Log To Console    Command type not developed
    END
    
execute-action
    [Arguments]    ${action}    ${input}
    ${value}=    Set Variable    ${input}[value]
    IF    '${action}[type]' == '${LAUNCH_BROWSER}'
        COMP_BrowserContext.new-page    ${input}[value]
    ELSE IF    '${action}[type]' == '${NEW_PAGE}'
        COMP_BrowserContext.new-page    ${input}[value]
    ELSE IF    '${action}[type]' == '${CLICK}'
        COMP_Button.left-click    ${action}[xpath]
    ELSE IF    '${action}[type]' == '${DOUBLE_CLICK}'
        COMP_Button.left-click    ${action}[xpath]
        COMP_Button.left-click    ${action}[xpath]
    ELSE IF    '${action}[type]' == '${GET_DROPDOWN_VALUE}'
        ${value}=    COMP_Select.get-selected-option    ${action}[xpath]
    ELSE IF    '${action}[type]' == '${SET_DROPDOWN_VALUE}'
        COMP_Select.select-single-option    ${action}[xpath]    ${input}[value]
    ELSE IF    '${action}[type]' == '${TYPE_TEXT}'
        COMP_Textbox.set-value    ${action}[xpath]    ${input}[value]
    ELSE IF    '${action}[type]' == '${GET_TEXTBOX_VALUE}'
        ${value}=    COMP_Textbox.get-value    ${action}[xpath]
    ELSE IF    '${action}[type]' == '${GET_CHECKBOX_VALUE}'
        ${value}=    COMP_Checkbox.get-value    ${action}[xpath]
        IF    ${value}
            ${value}=    Set Variable    SELECT
        ELSE
            ${value}=    Set Variable    UN_SELECT
        END
    ELSE IF    '${action}[type]' == '${SET_CHECKBOX_VALUE}'
        ${select}=    evaluate(${input}[value] == SELECT)
        COMP_Checkbox.set-value    ${action}[xpath]    ${select}
    ELSE IF    '${action}[type]' == '${GET_RADIO_VALUE}'
        ${value}=    COMP_Checkbox.get-value    ${action}[xpath]
        IF    ${value}
            ${value}=    Set Variable    SELECT
        ELSE
            ${value}=    Set Variable    UN_SELECT
        END
    ELSE IF    '${action}[type]' == '${SET_RADIO_VALUE}'
        ${select}=    evaluate(${input}[value] == SELECT)
        COMP_Checkbox.set-value    ${action}[xpath]    ${select}
    ELSE IF    '${action}[type]' == '${IS_ELEMENT_VISIBLE}'
        ${value}=    Util_BrowserHelper.is-attached-after-wait    ${action}[xpath]
    ELSE IF    '${action}[type]' == '${GET_TEXT}'
        ${value}=    Util_BrowserHelper.get-property    ${action}[xpath]    innerText
    ELSE
        Log To Message    Action not developed. Terminate the TestCase here!!!
        EX_Exception.ex-fail    ACTION_NOT_DEVELOPED
    END
    Log To Console    ${value}
    BuiltIn.Sleep    ${input}[waitAfterAction]s

send-action-sequence-message
    [Arguments]    ${flowActionSequenceId}    ${testCaseRunId}    ${status}    ${errorMessage}=${EMPTY}
    ${response_message}=    Create Dictionary    
    ...    flowActionSequenceId=${flowActionSequenceId}   
    ...    testCaseRunId=${testCaseRunId}   
    ...    status=${status}    
    ...    errorMessage=${errorMessage}
    UTIL_Common.Push response message to kafka topic    ${response_message}

send-flow-sequence-message
    [Arguments]    ${testCaseFlowSequenceId}    ${testCaseRunId}    ${status}    ${errorMessage}=${EMPTY}
    ${response_message}=    Create Dictionary    
    ...    testCaseFlowSequenceId=${testCaseFlowSequenceId}   
    ...    testCaseRunId=${testCaseRunId}   
    ...    status=${status}    
    ...    errorMessage=${errorMessage}
    UTIL_Common.Push response message to kafka topic    ${response_message}

send-test-case-run-message
    [Arguments]    ${testCaseRunId}    ${status}    ${errorMessage}=${EMPTY}
    ${response_message}=    Create Dictionary    
    ...    testCaseRunId=${testCaseRunId}   
    ...    status=${status}    
    ...    errorMessage=${errorMessage}
    UTIL_Common.Push response message to kafka topic    ${response_message}
