*** Settings ***
Library     Collections
Library     RPA.Browser.Playwright
Resource    ../../utils/UTIL_Validation.resource
Resource    ../../utils/exceptions/EX_Exception.resource
Resource    ../../utils/UTIL_BrowserHelper.resource
Resource    ../../utils/UTIL_String.resource


*** Keywords ***
get-options
    [Documentation]    Gets select options
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_SELECTBOX,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ERROR_WHILE_ACCESSING_SELECTBOX
    ...
    [Tags]    component
    [Arguments]    ${selector}
    COMP_Select.validate-precondition    ${selector}
    UTIL_Validation.fail-if-not-enabled-after-wait    ${selector}
    TRY
        ${select_options}=    RPA.Browser.Playwright.Get Select Options    ${selector}
        RETURN    ${select_options}
    EXCEPT    AS    ${error_message}
        Log To Console    Error in selectbox get options: ${error_message}    ERROR
        EX_Exception.ex-fail    ERROR_WHILE_ACCESSING_SELECTBOX
    END

get-selected-option
    [Documentation]    Gets the selected option
    ...    Error will thrown if multiple options selected
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    ...    ELEMENT_NOT_A_SELECTBOX
    ...    ELEMENT_NOT_VISIBLE
    ...    MULTIPLE_OPTIONS_SELECTED
    ...    NO_OPTION_SELECTED
    ...    ERROR_WHILE_ACCESSING_SELECTBOX
    [Tags]    component
    [Arguments]    ${selector}
    COMP_Select.validate-precondition    ${selector}
    ${selected_options}=    Create List
    TRY
        ${selected_options}=    RPA.Browser.Playwright.Get Selected Options    ${selector}
    EXCEPT    AS    ${error_message}
        Log To Console    Error in selectbox get selected options: ${error_message}    ERROR
        EX_Exception.ex-fail    ERROR_WHILE_ACCESSING_SELECTBOX
    END
    ${selected_length}=    Get Length    ${selected_options}
    UTIL_Validation.fail-keyword-if    ${selected_length == ${0}}    NO_OPTION_SELECTED
    UTIL_Validation.fail-keyword-if    ${selected_length >> ${1}}    MULTIPLE_OPTIONS_SELECTED
    RETURN    ${selected_options}[0]

select-single-option
    [Documentation]    Selects the option by given attribute
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${value}:    string
    ...    ${attribute}:    string
    ...    ${retry_count}:string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    ...    ELEMENT_NOT_A_SELECTBOX
    ...    ELEMENT_NOT_VISIBLE
    ...    ELEMENT_NOT_ENABLED
    ...    SELECT_OPTION_NOT_ATTACHED
    ...    SELECT_OPTION_NOT_ENABLED
    ...    UNABLE_TO_SELECT_OPTIONS
    ...    ERROR_WHILE_ACCESSING_SELECTBOX
    ...
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    component
    [Arguments]    ${selector}    ${value}    ${attribute}=label    ${retry_count}=3
    COMP_Select.validate-precondition    ${selector}
    UTIL_Validation.fail-if-not-enabled-after-wait    ${selector}
    ${retry_info}=    Create Dictionary    is_first_try=${True}
    TRY
        Wait Until Keyword Succeeds
        ...    ${retry_count}
        ...    1s
        ...    COMP_Select.select-options-and-validate-post-condition
        ...    ${retry_info}
        ...    ${selector}
        ...    ${attribute}
        ...    ${value}
    EXCEPT    AS    ${err_msg}
        EX_Exception.ex-throw-actual-message-from-retry-error-message    ${err_msg}
    END

# ======== Helper functions =======

validate-precondition
    [Documentation]    Method used to validate if the selector is actually a selectbox
    ...    Also used to validate the select element before performing any action
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_SELECTBOX,
    ...    ELEMENT_NOT_VISIBLE
    [Tags]    robot:private
    [Arguments]    ${selector}
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}
    UTIL_Validation.fail-if-not-a-selectbox    ${selector}
    UTIL_Validation.fail-if-not-visible-after-wait    ${selector}

select-options-and-validate-post-condition
    [Documentation]    Method used to set single select option and validate post condition
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${attribute}: string
    ...    @{values}: list
    ...
    ...    THROWS:
    ...    UNABLE_TO_SELECT_OPTIONS,
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    robot:private
    [Arguments]    ${retry_info}    ${selector}    ${attribute}    @{values}

    IF    ${retry_info}[is_first_try] == ${False}
        COMP_Select.validate-precondition    ${selector}
        UTIL_Validation.fail-if-not-enabled-after-wait    ${selector}
    ELSE
        Set To Dictionary    ${retry_info}    is_first_try=${False}
    END

    ${option_attribute}=    Set Variable    @${attribute}
    IF    '${attribute}' == 'label'
        ${option_attribute}=    Set Variable    text()
    END
    FOR    ${option}    IN    @{values}
        validate-option-precondition    ${selector}/option[${option_attribute}="${option}"]
    END
    TRY
        ${selected}=    RPA.Browser.Playwright.Select Options By    ${selector}    ${attribute}    @{values}
    EXCEPT    AS    ${err_msg}
        Log To Console    ${err_msg}
        EX_Exception.ex-fail    UNKNOWN_ERROR_OCCURRED
    END

    # postcondition
    FOR    ${option}    IN    @{values}
        Log To Console    ==Selected: ${option}==
        List Should Contain Value    ${selected}    ${option}    UNABLE_TO_SELECT_OPTIONS
    END

validate-option-precondition
    [Documentation]    Checks if the option is attached and enabled
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    SELECT_OPTION_NOT_ATTACHED,
    ...    SELECT_OPTION_NOT_ENABLED
    [Tags]    robot:private
    [Arguments]    ${selector}
    Log To Console    Validating select option selector: ${selector}
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}    SELECT_OPTION_NOT_ATTACHED
    UTIL_Validation.fail-if-not-enabled-after-wait    ${selector}    SELECT_OPTION_NOT_ENABLED
