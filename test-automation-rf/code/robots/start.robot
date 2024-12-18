*** Settings ***
Library     Collections
Library     DateTime
Library     Dialogs
Library     OperatingSystem
Library     String
Library     RPA.Browser.Playwright
Library     ../CommandConsumer.py
Library     ./utils/Common_util.py
Resource    ./utils/UTIL_Collection.resource
Resource    ./utils/UTIL_BrowserHelper.resource
Resource    ./utils/UTIL_Common.resource
Resource    ./modules/components/COMP_Button.resource
Resource    ./modules/components/COMP_Textbox.resource
Resource    ./modules/components/COMP_Checkbox.resource
Resource    ./modules/components/COMP_Select.resource
Resource    ./modules/components/COMP_BrowserContext.resource


*** Variables ***
${MAX_TIMEOUT}                      10
${TERMINATION_FLAG}                 ${False}
${COMMAND_TYPE_START_RUN}           START_RUN
${COMMAND_TYPE_TERMINATE_RUN}       TERMINATE_RUN

${LAUNCH_BROWSER}                   LAUNCH_BROWSER
${NEW_PAGE}                         NEW_PAGE
${CLICK}                            CLICK
${DOUBLE_CLICK}                     DOUBLE_CLICK
${GET_DROPDOWN_VALUE}               GET_DROPDOWN_VALUE
${SET_DROPDOWN_VALUE}               SET_DROPDOWN_VALUE
${TYPE_TEXT}                        TYPE_TEXT
${GET_TEXTBOX_VALUE}                GET_TEXTBOX_VALUE
${GET_CHECKBOX_VALUE}               GET_CHECKBOX_VALUE
${SET_CHECKBOX_VALUE}               SET_CHECKBOX_VALUE
${GET_RADIO_VALUE}                  GET_RADIO_VALUE
${SET_RADIO_VALUE}                  SET_RADIO_VALUE
${IS_ELEMENT_VISIBLE}               IS_ELEMENT_VISIBLE
${GET_TEXT}                         GET_TEXT


*** Tasks ***
initialize-fb-worker
    execute-functional-block


*** Keywords ***
execute-functional-block
    [Documentation]    To execute fb
    [Tags]    to-initialize-library
    WHILE    '${TERMINATION_FLAG}' == 'False'
        Log To Console    <===Polling message===>
        ${json}=    CommandConsumer.Get A Command    ${5}
        IF    '${json}[type]' == 'KILL'    BREAK
        COMP_BrowserContext.launch-browser
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
        ${assertions}=    Set Variable    ${testCase}[assertions]
        Log To Console    Test Case Name: ${testCase}[name]
        TRY
            ${is_test_case_flow_sequences_exists}=    UTIL_Collection.is-value-not-none
            ...    ${testCase}
            ...    testCaseFlowSequences
            ${test_case_run_response_message}=    Create Dictionary
            ...    testCaseRunId=${testCaseRun}[id]
            ...    status=STARTED
            UTIL_Common.Push response message to kafka topic    ${test_case_run_response_message}
            IF    $is_test_case_flow_sequences_exists
                ${ACCUMULATION}=    Create Dictionary
                FOR    ${testCaseFlowSequence}    IN    @{testCase}[testCaseFlowSequences]
                    TRY
                        ${flow}=    Set Variable    ${testCaseFlowSequence}[flow]
                        Log To Console    Flow Name: ${flow}[name]
                        ${is_flow_action_sequences_exists}=    UTIL_Collection.is-value-not-none
                        ...    ${flow}
                        ...    flowActionSequences
                        IF    $is_flow_action_sequences_exists
                            FOR    ${flowActionSequence}    IN    @{flow}[flowActionSequences]
                                TRY
                                    ${action}=    Set Variable    ${flowActionSequence}[action]
                                    Log To Console    Action Name: ${action}[name]
                                    ${input}=    Common_util.Get Selected Input    ${flowActionSequence}
                                    IF    $input == $None
                                        Log To Console
                                        ...    Input not found for this action. Terminating the test case here!!!
                                        EX_Exception.ex-fail    INPUT_NOT_FOUND_IN_ACTION
                                    END
                                    ${value}=    execute-action    ${action}    ${input}
                                    ${assertion_message}=    perform-assertion
                                    ...    ${ACCUMULATION}
                                    ...    ${assertions}
                                    ...    ${testCaseFlowSequence}[id]
                                    ...    ${flowActionSequence}[id]
                                    ...    ${value}
                                    Log To Console    ${assertion_message}
                                    send-action-sequence-message
                                    ...    ${flowActionSequence}[flowActionSequenceHistoryId]
                                    ...    COMPLETED
                                    ...    ${action}
                                    ...    ${input}
                                    ...    ${EMPTY}
                                    ...    ${assertion_message}
                                    BuiltIn.Sleep    ${input}[waitAfterAction]s
                                EXCEPT    AS    ${error_message}
                                    Log To Console    ${error_message}
                                    send-action-sequence-message
                                    ...    ${flowActionSequence}[flowActionSequenceHistoryId]
                                    ...    FAILED
                                    ...    ${action}
                                    ...    ${input}
                                    ...    ${error_message}
                                    EX_Exception.ex-fail    ${error_message}
                                END
                            END
                        END
                        send-flow-sequence-message
                        ...    ${testCaseFlowSequence}[testCaseFlowSequenceHistoryId]
                        ...    COMPLETED
                    EXCEPT    AS    ${error_message}
                        Log To Console    ${error_message}
                        send-flow-sequence-message
                        ...    ${testCaseFlowSequence}[testCaseFlowSequenceHistoryId]
                        ...    FAILED
                        ...    ${error_message}
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
        COMP_Button.left-click    ${action}[selector][xpath]
    ELSE IF    '${action}[type]' == '${DOUBLE_CLICK}'
        COMP_Button.left-click    ${action}[selector][xpath]
        COMP_Button.left-click    ${action}[selector][xpath]
    ELSE IF    '${action}[type]' == '${GET_DROPDOWN_VALUE}'
        ${value}=    COMP_Select.get-selected-option    ${action}[selector][xpath]
    ELSE IF    '${action}[type]' == '${SET_DROPDOWN_VALUE}'
        COMP_Select.select-single-option    ${action}[selector][xpath]    ${input}[value]
    ELSE IF    '${action}[type]' == '${TYPE_TEXT}'
        COMP_Textbox.set-value    ${action}[selector][xpath]    ${input}[value]
        IF    ${action}[enter]
            RPA.Browser.Playwright.Keyboard key    press    Enter
        END
    ELSE IF    '${action}[type]' == '${GET_TEXTBOX_VALUE}'
        ${value}=    COMP_Textbox.get-value    ${action}[selector][xpath]
    ELSE IF    '${action}[type]' == '${GET_CHECKBOX_VALUE}'
        ${value}=    COMP_Checkbox.get-value    ${action}[selector][xpath]
        IF    ${value}
            ${value}=    Set Variable    TRUE
        ELSE
            ${value}=    Set Variable    FALSE
        END
    ELSE IF    '${action}[type]' == '${SET_CHECKBOX_VALUE}'
        ${select}=    evaluate(${input}[value] == TRUE)
        COMP_Checkbox.set-value    ${action}[selector][xpath]    ${select}
    ELSE IF    '${action}[type]' == '${GET_RADIO_VALUE}'
        ${value}=    COMP_Checkbox.get-value    ${action}[selector][xpath]
        IF    ${value}
            ${value}=    Set Variable    TRUE
        ELSE
            ${value}=    Set Variable    FALSE
        END
    ELSE IF    '${action}[type]' == '${SET_RADIO_VALUE}'
        ${select}=    evaluate(${input}[value] == TRUE)
        COMP_Checkbox.set-value    ${action}[selector][xpath]    ${select}
    ELSE IF    '${action}[type]' == '${IS_ELEMENT_VISIBLE}'
        ${value}=    Util_BrowserHelper.is-attached-after-wait    ${action}[selector][xpath]
        IF    ${value}
            ${value}=    Set Variable    TRUE
        ELSE
            ${value}=    Set Variable    FALSE
        END
    ELSE IF    '${action}[type]' == '${GET_TEXT}'
        ${value}=    Util_BrowserHelper.get-property    ${action}[selector][xpath]    innerText
    ELSE
        Log To Message    Action not developed. Terminate the TestCase here!!!
        EX_Exception.ex-fail    ACTION_NOT_DEVELOPED
    END
    Log To Console    ${value}
    RETURN    ${value}

perform-assertion
    [Arguments]    ${ACCUMULATION}    ${assertions}    ${testCaseFlowSequenceId}    ${flowActionSequenceId}    ${value}
    ${key}=    Set Variable
    ...    testCaseFlowSequenceId:${testCaseFlowSequenceId}::flowActionSequenceId:${flowActionSequenceId}
    FOR    ${assertion}    IN    @{assertions}
        ${source}=    Set Variable    ${assertion}[source]
        ${target}=    Set Variable    ${assertion}[target]
        ${skip}=    Set Variable    ${assertion}[skip]
        ${operator}=    Set Variable    ${assertion}[operator]
        ${useCustomTargetValue}=    Set Variable    ${assertion}[useCustomTargetValue]
        ${customTargetValue}=    Set Variable    ${assertion}[customTargetValue]
        ${errorMessage}=    Set Variable    ${assertion}[errorMessage]
        Set To Dictionary    ${ACCUMULATION}    ${key}=${value}
        ${is_source_exists}=    UTIL_Collection.is-value-not-none    ${ACCUMULATION}    ${source}
        ${is_target_exists}=    UTIL_Collection.is-value-not-none    ${ACCUMULATION}    ${target}
        IF    '${source}' == '${key}' and '${is_source_exists}' == '${True}'
            IF    $skip    RETURN    Skipped assertion!!
            IF    $useCustomTargetValue
                ${message}=    assert
                ...    ${ACCUMULATION}[${source}]
                ...    ${customTargetValue}
                ...    ${operator}
                ...    ${errorMessage}
                RETURN    ${message}
            END
            IF    $is_target_exists
                ${message}=    assert
                ...    ${ACCUMULATION}[${source}]
                ...    ${ACCUMULATION}[${target}]
                ...    ${operator}
                ...    ${errorMessage}
                RETURN    ${message}
            END
        END
        IF    '${target}' == '${key}' and '${is_target_exists}' == '${True}'
            IF    $skip    RETURN    Skipped assertion!!
            IF    $useCustomTargetValue
                Log To Console    No need to assert here.
            END
            IF    $is_source_exists
                ${message}=    assert
                ...    ${ACCUMULATION}[${source}]
                ...    ${ACCUMULATION}[${target}]
                ...    ${operator}
                ...    ${errorMessage}
                RETURN    ${message}
            END
        END
    END

assert
    [Documentation]    Method used to assert and return assertion message
    [Arguments]    ${source}    ${target}    ${operator}    ${errorMessage}
    IF    '${operator}' == 'SHOULD_BE_EQUAL_TO'
        BuiltIn.Should Be Equal    ${source}    ${target}    ${errorMessage}
        RETURN    Assertion passed: ${source} == ${target}
    ELSE IF    '${operator}' == 'SHOULD_NOT_BE_EQUAL_TO'
        BuiltIn.Should Not Be Equal    ${source}    ${target}    ${errorMessage}
        RETURN    Assertion passed: ${source} != ${target}
    ELSE IF    '${operator}' == 'CONTAINS'
        ${contains}=    UTIL_String.check-string-contains    ${source}    ${target}
        IF    $contains
            RETURN    Assertion passed: ${source} contains ${target}
        END
        Fail    ${errorMessage}: ${source} does not contain ${target}
    ELSE IF    '${operator}' == 'TARGET_CONTAINS_SOURCE'
        ${contains}=    UTIL_String.check-string-contains    ${target}    ${source}
        IF    $contains
            RETURN    Assertion passed: ${target} contains ${source}
        END
        Fail    ${errorMessage}: ${target} does not contain ${source}
    ELSE IF    '${operator}' == 'SHOULD_NOT_CONTAIN'
        ${contains}=    UTIL_String.check-string-contains    ${source}    ${target}
        IF    $contains
            Fail    ${errorMessage}: ${source} contains ${target}
        ELSE
            RETURN    Assertion passed: ${source} does not contain ${target}
        END
    ELSE IF    '${operator}' == 'TARGET_SHOULD_NOT_CONTAIN_SOURCE'
        ${contains}=    UTIL_String.check-string-contains    ${target}    ${source}
        IF    $contains
            Fail    ${errorMessage}: ${target} contains ${source}
        ELSE
            RETURN    Assertion passed: ${target} does not contain (${source})
        END
    END

send-action-sequence-message
    [Arguments]
    ...    ${flowActionSequenceHistoryId}
    ...    ${status}
    ...    ${action}
    ...    ${input}
    ...    ${errorMessage}=${EMPTY}
    ...    ${assertionMessage}=${EMPTY}

    ${is_selector_exists}=    UTIL_Collection.is-value-not-none    ${action}    selector
    IF    $is_selector_exists
        ${xpath}=    Set Variable    ${action}[selector][xpath]
    ELSE
        ${xpath}=    Set Variable    ${EMPTY}
    END

    ${response_message}=    Create Dictionary
    ...    flowActionSequenceHistoryId=${flowActionSequenceHistoryId}
    ...    status=${status}
    ...    actionName=${action}[name]
    ...    actionType=${action}[type]
    ...    actionXpath=${xpath}
    ...    inputValue=${input}[value]
    ...    errorMessage=${errorMessage}
    ...    assertionMessage=${assertionMessage}
    UTIL_Common.Push response message to kafka topic    ${response_message}

send-flow-sequence-message
    [Arguments]    ${testCaseFlowSequenceHistoryId}    ${status}    ${errorMessage}=${EMPTY}
    ${response_message}=    Create Dictionary
    ...    testCaseFlowSequenceHistoryId=${testCaseFlowSequenceHistoryId}
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
