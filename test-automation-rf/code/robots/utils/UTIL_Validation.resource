*** Settings ***
Library     Collections
Library     OperatingSystem
Resource    exceptions/EX_Exception.resource
Resource    UTIL_BrowserHelper.resource


*** Keywords ***
fail-keyword-if
    [Documentation]    Throws error with a custom message if given condition satisifes
    ...    first argument must be an expression/boolean
    ...    second argument must a message
    ...    Eg: fail-keyword-if    {var1 == var2}    {message}
    ...
    ...    INPUT:
    ...    ${condition}: boolean
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ${message}
    [Tags]    util
    [Arguments]    ${condition}    ${message}
    IF    ${condition}
        Log To Console    Conditional exception: ${message}    ERROR
        EX_Exception.ex-fail    ${message}
    END

fail-if-multiple-elements-found
    [Documentation]    Throws error if multiple elements found for the given selector
    [Arguments]    ${selector}    ${message}=FOUND_MULTIPLE_ELEMENTS
    ${count}=    UTIL_BrowserHelper.get-element-count    ${selector}
    fail-keyword-if    ${count >> ${1}}    ${message}

fail-if-not-attached-after-wait
    [Documentation]    Throws error if the element is not attached to the DOM
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ${message}/ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_ATTACHED
    fail-if-multiple-elements-found    ${selector}
    ${is_attached}=    UTIL_BrowserHelper.is-attached-after-wait    ${selector}
    fail-keyword-if    ${is_attached == False}    ${message}

fail-if-attached-after-wait
    [Documentation]    Throws error if the element is attached to the DOM
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ${message}/ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_ATTACHED
    ${is_attached}=    UTIL_BrowserHelper.is-attached-after-wait    ${selector}
    UTIL_Validation.fail-keyword-if    ${is_attached}    ${message}

fail-if-not-enabled-after-wait
    [Documentation]    Throws error if the element is not enabled
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_ENABLED
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_ENABLED
    ${is_enabled}=    UTIL_BrowserHelper.is-enabled-after-wait    ${selector}
    fail-keyword-if    ${is_enabled == False}    ${message}

fail-if-not-editable-after-wait
    [Documentation]    Throws error if the element is not editable
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_EDITABLE
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_EDITABLE
    ${is_editable}=    UTIL_BrowserHelper.is-editable-after-wait    ${selector}
    fail-keyword-if    ${is_editable == False}    ${message}

fail-if-not-visible-after-wait
    [Documentation]    Throws error if the element is not visible
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_VISIBLE
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_VISIBLE
    ${is_visible}=    UTIL_BrowserHelper.is-visible-after-wait    ${selector}
    fail-keyword-if    ${is_visible == False}    ${message}

fail-if-not-a-button
    [Documentation]    Throws error if the element is not a valid button
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_A_BUTTON
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_A_BUTTON
    TRY
        ${tag_name}=    UTIL_BrowserHelper.get-property    ${selector}    tagName
        ${button_tag_names}=    Create List
        ...    BUTTON
        ...    A
        ...    INPUT
        ...    LI
        ...    DIV
        ...    MAT-SELECT
        ...    MAT-OPTION
        ...    MAT-CHECKBOX
        List Should Contain Value    ${button_tag_names}    ${tag_name}    ${message}
    EXCEPT    INVALID_BROWSER_ELEMENT_PROPERTY
        EX_Exception.ex-fail    ${message}
    END

fail-if-not-a-radio-button
    [Documentation]    Throws error if the element is not a valid radio button
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_A_RADIO_BUTTON
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_A_RADIO_BUTTON
    TRY
        ${tag_name}=    UTIL_BrowserHelper.get-property    ${selector}    tagName
        ${button_tag_names}=    Create List
        ...    MAT-RADIO-BUTTON
        List Should Contain Value    ${button_tag_names}    ${tag_name}    ${message}
    EXCEPT    INVALID_BROWSER_ELEMENT_PROPERTY
        EX_Exception.ex-fail    ${message}
    END

fail-if-not-a-textbox
    [Documentation]    Throws error if the element is not a valid textbox
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_A_TEXTBOX
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_A_TEXTBOX
    TRY
        ${tag_name}=    UTIL_BrowserHelper.get-property    ${selector}    tagName
        fail-keyword-if    ${tag_name != 'INPUT'}    ${message}
    EXCEPT    INVALID_BROWSER_ELEMENT_PROPERTY
        EX_Exception.ex-fail    ${message}
    END

fail-if-not-a-password-textbox
    [Documentation]    Throws error if the element is not a valid password textbox
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_A_PASSWORD_TEXTBOX
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_A_PASSWORD_TEXTBOX
    TRY
        ${type}=    UTIL_BrowserHelper.get-property    ${selector}    type
        fail-keyword-if    ${type != 'password'}    ${message}
    EXCEPT    INVALID_BROWSER_ELEMENT_PROPERTY
        EX_Exception.ex-fail    ${message}
    END

fail-if-not-a-checkbox
    [Documentation]    Throws error if the element is not a valid checkbox
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_A_CHECKBOX
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_A_CHECKBOX
    TRY
        ${type}=    UTIL_BrowserHelper.get-property    ${selector}    type
        fail-keyword-if    ${type != 'checkbox'}    ${message}
    EXCEPT    INVALID_BROWSER_ELEMENT_PROPERTY
        EX_Exception.ex-fail    ${message}
    END

fail-if-not-a-selectbox
    [Documentation]    Throws error if the element is not a valid selectbox
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    ${message}/ELEMENT_NOT_A_SELECTBOX
    [Tags]    util
    [Arguments]    ${selector}    ${message}=ELEMENT_NOT_A_SELECTBOX
    TRY
        ${type}=    UTIL_BrowserHelper.get-property    ${selector}    tagName
        fail-keyword-if    ${type != 'SELECT'}    ${message}
    EXCEPT    INVALID_BROWSER_ELEMENT_PROPERTY
        EX_Exception.ex-fail    ${message}
    END
