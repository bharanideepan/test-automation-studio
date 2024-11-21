*** Settings ***
Library     RPA.Browser.Playwright
Resource    ../../utils/UTIL_Validation.resource
Resource    ../../utils/exceptions/EX_Exception.resource
Resource    ../../utils/UTIL_BrowserHelper.resource
Resource    ../../utils/UTIL_String.resource

*** Keywords ***
comp-set-value
    [Documentation]    Updates Field Value and checks for post condition
    ...    And retries if the retry value is provided
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${value}: string
    ...    ${retry_count}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_TEXTBOX,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_EDITABLE,
    ...    VALUE_NOT_POPULATED,
    ...
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    component
    [Arguments]    ${selector}    ${value}    ${retry_count}=3
    COMP_Textbox.validate-precondition    ${selector}
    UTIL_Validation.util-fail-if-not-editable-after-wait    ${selector}
    ${retry_info}=    Create Dictionary    is_first_try=${True}
    TRY
        Wait Until Keyword Succeeds
        ...    ${retry_count}
        ...    1s
        ...    COMP_Textbox.fill-text-and-validate-post-condition
        ...    ${retry_info}
        ...    ${selector}
        ...    ${value}
    EXCEPT    AS    ${err_msg}
        EX_Exception.ex-throw-actual-message-from-retry-error-message    ${err_msg}
    END

comp-set-password-secret
    [Documentation]    Updates Password Field
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${retry_count}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_PASSWORD_TEXTBOX,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_EDITABLE,
    ...    ELEMENT_NOT_ENABLED.
    ...
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    component
    [Arguments]    ${selector}    ${retry_count}=3
    TRY
        COMP_Textbox.validate-precondition    ${selector}
    EXCEPT    ELEMENT_NOT_A_TEXT_BOX
        EX_Exception.ex-fail    ELEMENT_NOT_A_PASSWORD_TEXTBOX
    END
    UTIL_Validation.util-fail-if-not-a-password-textbox    ${selector}
    UTIL_Validation.util-fail-if-not-editable-after-wait    ${selector}
    ${retry_info}=    Create Dictionary    is_first_try=${True}
    TRY
        Wait Until Keyword Succeeds
        ...    ${retry_count}
        ...    1s
        ...    COMP_Textbox.fill-password-and-validate-post-condition
        ...    ${retry_info}
        ...    ${selector}
    EXCEPT    AS    ${err_msg}
        EX_Exception.ex-throw-actual-message-from-retry-error-message    ${err_msg}
    END

comp-get-value
    [Documentation]    Returns Field Value
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_TEXTBOX,
    ...    ELEMENT_NOT_VISIBLE
    [Tags]    component
    [Arguments]    ${selector}
    COMP_Textbox.validate-precondition    ${selector}
    ${fieldTextValue}=    UTIL_BrowserHelper.util-get-property    ${selector}    value
    RETURN    ${fieldTextValue}

# ======== Helper functions =======

validate-precondition
    [Documentation]    Method used to validate if the selector is actually an input
    ...    Also used to validate the input element before performing any action
    ...    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_TEXTBOX,
    ...    ELEMENT_NOT_VISIBLE
    [Tags]    robot:private
    [Arguments]    ${selector}
    UTIL_Validation.util-fail-if-not-attached-after-wait    ${selector}
    UTIL_Validation.util-fail-if-not-a-textbox    ${selector}
    UTIL_Validation.util-fail-if-not-visible-after-wait    ${selector}

fill-text-and-validate-post-condition
    [Documentation]    Updates the Field value and checks for post condition
    ...    And retries if the retry value is provided
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${value}: string
    ...
    ...    THROWS:
    ...    VALUE_NOT_POPULATED,
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    robot:private
    [Arguments]    ${retry_info}    ${selector}    ${value}

    IF    ${retry_info}[is_first_try] == ${False}
        COMP_Textbox.validate-precondition    ${selector}
        UTIL_Validation.util-fail-if-not-editable-after-wait    ${selector}
    ELSE
        Set To Dictionary    ${retry_info}    is_first_try=${False}
    END
    TRY
        RPA.Browser.Playwright.Scroll To Element    ${selector}
        RPA.Browser.Playwright.Fill Text    ${selector}    ${value}
    EXCEPT    AS    ${err_msg}
        Log To Console    ${err_msg}
        EX_Exception.ex-fail    UNKNOWN_ERROR_OCCURRED
    END

    # Postcondition
    COMP_Textbox.fail-if-value-not-populated    ${selector}    ${value}

fail-if-value-not-populated
    [Documentation]    Fails if the value is not populated in the given input field
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${value}: string
    ...
    ...    THROWS:
    ...    VALUE_NOT_POPULATED
    [Tags]    robot:private
    [Arguments]    ${selector}    ${value}
    ${populated_value}=    COMP_Textbox.comp-get-value    ${selector}
    ${matches}=    UTIL_String.util-compare-strings    ${populated_value}    ${value}
    UTIL_Validation.util-fail-keyword-if    ${matches == False}    VALUE_NOT_POPULATED

fill-password-and-validate-post-condition
    [Documentation]    Updates the Field value and checks for post condition
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    And retries if the retry value is provided
    ...    THROWS:
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    robot:private
    [Arguments]    ${retry_info}    ${selector}

    IF    ${retry_info}[is_first_try] == ${False}
        TRY
            COMP_Textbox.validate-precondition    ${selector}
        EXCEPT    ELEMENT_NOT_A_TEXT_BOX
            EX_Exception.ex-fail    ELEMENT_NOT_A_PASSWORD_TEXTBOX
        END
        UTIL_Validation.util-fail-if-not-a-password-textbox    ${selector}
        UTIL_Validation.util-fail-if-not-editable-after-wait    ${selector}
    ELSE
        Set To Dictionary    ${retry_info}    is_first_try=${False}
    END

    TRY
        RPA.Browser.Playwright.Scroll To Element    ${selector}
        RPA.Browser.Playwright.Fill Secret    ${selector}    $APP_PASSWORD_SECRET
    EXCEPT    AS    ${err_msg}
        Log To Console    ${err_msg}
        EX_Exception.ex-fail    UNKNOWN_ERROR_OCCURRED
    END
