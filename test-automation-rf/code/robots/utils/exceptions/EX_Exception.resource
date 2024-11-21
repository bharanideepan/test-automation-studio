*** Settings ***
Library     Collections
Library     String
Library     RPA.Browser.Playwright


*** Keywords ***
ex-fail
    [Documentation]    wrapper over the builtin Fail keyword, to support additional operations during failure
    [Tags]    exception
    [Arguments]    ${exception}
    Log To Console    <===Error occurred:${exception}===>    ERROR
    Fail    ${exception}

ex-throw-actual-message-from-retry-error-message
    [Documentation]    Method used to get the actual message from string(Error msg from retry)
    [Tags]    exception
    [Arguments]    ${exception}
    @{exception_slip}=    String.Split String    ${exception}    separator=The last error was:
    EX_Exception.ex-fail    ${exception_slip[1].strip()}
