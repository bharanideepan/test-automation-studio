*** Settings ***
Library     RPA.Browser.Playwright
Resource    ../../utils/UTIL_Validation.resource
Resource    ../../utils/exceptions/EX_Exception.resource
Resource    ../../utils/UTIL_BrowserHelper.resource
Resource    ../../utils/UTIL_String.resource


*** Keywords ***
get-value
    [Documentation]    Gets the current checkbox status
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_CHECKBOX,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ERROR_WHILE_ACCESSING_CHECKBOX
    [Tags]    component
    [Arguments]    ${selector}
    COMP_Checkbox.validate-precondition    ${selector}
    TRY
        ${is_checked}=    RPA.Browser.Playwright.Get Checkbox State    ${selector}
        RETURN    ${is_checked}
    EXCEPT    AS    ${error_message}
        Log To Console    Error in checkbox get value: ${error_message}    ERROR
        EX_Exception.ex-fail    ERROR_WHILE_ACCESSING_CHECKBOX
    END

set-value
    [Documentation]    Updates the Field value and checks for post condition
    ...    And retries if the retry value is provided
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${perform_check}: boolean
    ...    ${retry_count}:    string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    ...    ELEMENT_NOT_A_CHECKBOX
    ...    ELEMENT_NOT_VISIBLE
    ...    ELEMENT_NOT_ENABLED
    ...    UNABLE_TO_CHECK_CHECKBOX
    ...    UNABLE_TO_UNCHECK_CHECKBOX
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    component
    [Arguments]    ${selector}    ${perform_check}    ${retry_count}=3
    COMP_Checkbox.validate-precondition    ${selector}
    UTIL_Validation.fail-if-not-enabled-after-wait    ${selector}
    ${retry_info}=    Create Dictionary    is_first_try=${True}
    TRY
        Wait Until Keyword Succeeds
        ...    ${retry_count}
        ...    1s
        ...    COMP_Checkbox.set-checkbox-value-and-validate-post-condition
        ...    ${retry_info}
        ...    ${selector}
        ...    ${perform_check}
    EXCEPT    AS    ${err_msg}
        EX_Exception.ex-throw-actual-message-from-retry-error-message    ${err_msg}
    END

# ======== Helper functions =======

validate-precondition
    [Documentation]    Method used to validate if the element is actually a checkbox
    ...    Also used to validate the checkbox element before performing any action
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    ...    ELEMENT_NOT_VISIBLE
    ...    ELEMENT_NOT_A_CHECKBOX
    [Tags]    robot:private
    [Arguments]    ${selector}
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}
    UTIL_Validation.fail-if-not-a-checkbox    ${selector}
    UTIL_Validation.fail-if-not-visible-after-wait    ${selector}

set-checkbox-value-and-validate-post-condition
    [Documentation]    Updates the Field value and checks for post condition
    ...    And retries if the retry value is provided
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${perform_check}: boolean
    ...
    ...    THROWS:
    ...    UNABLE_TO_CHECK_CHECKBOX
    ...    UNABLE_TO_UNCHECK_CHECKBOX
    ...    ERROR_WHILE_ACCESSING_CHECKBOX
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    robot:private
    [Arguments]    ${retry_info}    ${selector}    ${perform_check}

    IF    ${retry_info}[is_first_try] == ${False}
        COMP_Checkbox.validate-precondition    ${selector}
        UTIL_Validation.fail-if-not-enabled-after-wait    ${selector}
    ELSE
        Set To Dictionary    ${retry_info}    is_first_try=${False}
    END

    TRY
        IF    ${perform_check} == ${True}
            RPA.Browser.Playwright.Check Checkbox    ${selector}    force=True
        ELSE
            RPA.Browser.Playwright.Uncheck Checkbox    ${selector}    force=True
        END
    EXCEPT    AS    ${err_msg}
        Log To Console    ${err_msg}
        EX_Exception.ex-fail    UNKNOWN_ERROR_OCCURRED
    END

    ${value}=    COMP_Checkbox.get-value    ${selector}
    IF    ${perform_check}
        UTIL_Validation.fail-keyword-if    ${value != ${perform_check}}    UNABLE_TO_CHECK_CHECKBOX
    ELSE
        UTIL_Validation.fail-keyword-if    ${value != ${perform_check}}    UNABLE_TO_UNCHECK_CHECKBOX
    END
