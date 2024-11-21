*** Settings ***
Library     Collections
Library     DateTime
Library     Dialogs
Library     OperatingSystem
Library     String
Library     RPA.Browser.Playwright
Library     ../CommandConsumer.py
Resource     ./utils/UTIL_Collection.resource


*** Variables ***
${MAX_TIMEOUT}          10
${TERMINATION_FLAG}     ${False}
${COMMAND_TYPE_START_RUN}     START_RUN
${COMMAND_TYPE_TERMINATE_RUN}     TERMINATE_RUN


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
        TRY
            execute-test-case    ${json}
        EXCEPT    AS    ${error_message}
            Log To Console    ${error_message}
        END
    END

execute-test-case
    [Arguments]    ${input}
    Log To Console    Test Case Data=> ${input}
    ${is_type_exists}=    UTIL_Collection.util-is-value-not-none    ${input}    type
    IF    $is_type_exists
        IF    '${input}[type]' == '${COMMAND_TYPE_START_RUN}'
            ${testCase}=    Set Variable    ${input}[payload][testCase]
            ${testCaseRun}=    Set Variable    ${input}[payload][testCaseRun]
            Log To Console    Test Case Name: ${testCase}[name]
            FOR    ${testCaseFlowSequence}    IN    @{testCase}[testCaseFlowSequences]
                ${flow}=    Set Variable    ${testCaseFlowSequence}[flow]
                Log To Console    Flow Name: ${flow}[name]
                FOR    ${flowActionSequence}    IN    @{flow}[flowActionSequences]
                    ${action}=    Set Variable    ${flowActionSequence}[action]
                    ${testCaseFlowSequenceActionInput}=    Set Variable    ${flowActionSequence}[testCaseFlowSequenceActionInput]
                    Log To Console    Action Name: ${action}[name]
                END
            END
        ELSE
            Log To Console    Command type not developed
        END
    ELSE
        Log To Console    Type not exists in the input
    END
