*** Settings ***
Library     Collections
Library     RPA.Browser.Playwright
Resource    ../../utils/UTIL_Validation.resource
Resource    ../../utils/exceptions/EX_Exception.resource
Resource    ../../utils/UTIL_BrowserHelper.resource
Resource    ../../utils/UTIL_String.resource
Resource    ../../modules/components/COMP_Button.resource
Resource    ../../modules/components/COMP_Select.resource


*** Keywords ***
get-selected-options
    [Documentation]    Gets all selected options
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_A_SELECTBOX,
    ...    ERROR_WHILE_ACCESSING_SELECTBOX
    [Tags]    component
    [Arguments]    ${selector}
    COMP_Select.validate-precondition    ${selector}
    TRY
        ${selected_options}=    RPA.Browser.Playwright.Get Selected Options    ${selector}
        ${selected_length}=    Get Length    ${selected_options}
        RETURN    ${selected_options}
    EXCEPT    AS    ${error_message}
        Log To Console    Error in multiselect get selected options: ${error_message}    ERROR
        EX_Exception.ex-fail    ERROR_WHILE_ACCESSING_SELECTBOX
    END

select-multiple-options
    [Documentation]    Selects the option by given attribute
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${values}: [string]
    ...    ${attribute}: string
    ...    ${retry_count}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_SELECTBOX,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_ENABLED,
    ...    SELECT_OPTION_NOT_ATTACHED,
    ...    SELECT_OPTION_NOT_ENABLED,
    ...    UNABLE_TO_SELECT_OPTIONS,
    ...    ERROR_WHILE_ACCESSING_SELECTBOX.
    ...
    ...    UNKNOWN_ERROR_OCCURRED
    [Tags]    component
    [Arguments]    ${selector}    @{values}    ${attribute}=label    ${retry_count}=3
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
        ...    @{values}
    EXCEPT    AS    ${err_msg}
        EX_Exception.ex-throw-actual-message-from-retry-error-message    ${err_msg}
    END

is-all-selected
    [Documentation]    Checks if all the options in the dropdown are selected
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_ENABLED,
    ...    ELEMENT_NOT_A_SELECTBOX,
    ...    ERROR_WHILE_ACCESSING_SELECTBOX
    [Tags]    component
    [Arguments]    ${selector}
    COMP_Select.validate-precondition    ${selector}
    ${selected_options}=    COMP_MultiSelect.get-selected-options    ${selector}
    ${options}=    COMP_Select.get-options    ${selector}
    ${selected_count}=    Get Length    ${selected_options}
    ${options_count}=    Get Length    ${options}
    RETURN    ${selected_count == ${options_count}}

is-all-unselected
    [Documentation]    Checks if all the options are unselected
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ELEMENT_NOT_A_SELECTBOX,
    ...    ELEMENT_NOT_VISIBLE,
    ...    ELEMENT_NOT_ENABLED,
    ...    ERROR_WHILE_ACCESSING_SELECTBOX
    [Tags]    component
    [Arguments]    ${selector}
    COMP_Select.validate-precondition    ${selector}
    ${selected_options}=    COMP_MultiSelect.get-selected-options    ${selector}
    ${selected_count}=    Get Length    ${selected_options}
    RETURN    ${selected_count == '0'}
