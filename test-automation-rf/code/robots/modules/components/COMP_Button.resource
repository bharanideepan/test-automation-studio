*** Settings ***
Library     RPA.Browser.Playwright
Resource    ../../utils/UTIL_Validation.resource
Resource    ../../utils/exceptions/EX_Exception.resource
Resource    ../../utils/UTIL_BrowserHelper.resource
Resource    ../../utils/UTIL_String.resource


*** Keywords ***
comp-left-click
    [Documentation]    Performs left click operation on button
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${retry_count}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_BUTTON,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_ENABLED,
    ...
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    component
    [Arguments]    ${selector}    ${retry_count}=${5}
    COMP_Button.validate-precondition    ${selector}
    ${retry_info}=    Create Dictionary    is_first_try=${True}
    TRY
        Wait Until Keyword Succeeds
        ...    ${retry_count}
        ...    1s
        ...    COMP_Button.perform-click-and-validate-post-condition
        ...    ${retry_info}
        ...    ${selector}
    EXCEPT    AS    ${err_msg}
        EX_Exception.ex-throw-actual-message-from-retry-error-message    ${err_msg}
    END

# ======== Helper functions =======

validate-precondition
    [Documentation]    Method used to validate if the selector is actually a button
    ...    Also used to validate the button element before performing any action
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_BUTTON,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_ENABLED
    [Tags]    robot:private
    [Arguments]    ${selector}
    UTIL_Validation.util-fail-if-not-attached-after-wait    ${selector}
    UTIL_Validation.util-fail-if-not-a-button    ${selector}
    UTIL_Validation.util-fail-if-not-visible-after-wait    ${selector}
    UTIL_Validation.util-fail-if-not-enabled-after-wait    ${selector}

perform-click-and-validate-post-condition
    [Documentation]    Method used to perform the click operation
    ...    And validate if the action is done successfully
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    robot:private
    [Arguments]    ${retry_info}    ${selector}

    IF    ${retry_info}[is_first_try] == ${False}
        COMP_Button.validate-precondition    ${selector}
    ELSE
        Set To Dictionary    ${retry_info}    is_first_try=${False}
    END

    TRY
        RPA.Browser.Scroll To Element    ${selector}
        RPA.Browser.Playwright.Click    ${selector}    left    1
    EXCEPT    AS    ${err_msg}
        Log To Console    ${err_msg}
        EX_Exception.ex-fail    UNKNOWN_ERROR_OCCURRED
    END
