*** Settings ***
Library     OperatingSystem
Library     DateTime
Library     RPA.Browser.Playwright
Library     RPA.PDF
Resource    ../utils/exceptions/EX_Exception.resource
Resource    ../utils/UTIL_Validation.resource
Resource    ../utils/UTIL_String.resource
Resource    UTIL_Collection.resource

*** Variable ***
${ELEMENT_STATE_ATTACHED}             attached
${ELEMENT_STATE_ENABLED}              enabled
${ELEMENT_STATE_VISIBLE}              visible
${ELEMENT_STATE_CHECKED}              checked
${ELEMENT_STATE_UNCHECKED}            unchecked
${ELEMENT_STATE_EDITABLE}             editable
${ELEMENT_STATE_HIDDEN}               hidden

*** Keywords ***
get-elements
    [Documentation]    Method is used to get the locator reference.
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    OUTPUT:
    ...    ${elements}: array
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    UNABLE_TO_GET_ELEMENTS.
    ...
    [Tags]    util
    [Arguments]    ${selector}
    # UTIL_Validation.fail-if-not-attached-after-wait    ${selector}
    TRY
        ${elements}=    RPA.Browser.Playwright.Get Elements    ${selector}
        RETURN    ${elements}
    EXCEPT    AS    ${error_message}
        Log To Console    ${error_message}    ERROR
        EX_Exception.ex-fail    UNABLE_TO_GET_ELEMENTS
    END

get-property
    [Documentation]    Method used to get property
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${property_name}: string
    ...
    ...    OUTPUT: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    INVALID_BROWSER_ELEMENT_PROPERTY
    [Tags]    util
    [Arguments]    ${selector}    ${property_name}
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}
    TRY
        ${property}=    RPA.Browser.Playwright.Get Property    ${selector}    ${property_name}
        RETURN    ${property}
    EXCEPT    AS    ${error_message}
        Log To Console    ${error_message}    ERROR
        EX_Exception.ex-fail    INVALID_BROWSER_ELEMENT_PROPERTY
    END

get-attribute
    [Documentation]    Method used to get property
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${attribute_name}: string
    ...
    ...    OUTPUT: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED,
    ...    INVALID_BROWSER_ELEMENT_ATTRIBUTE
    [Tags]    util
    [Arguments]    ${selector}    ${attribute_name}
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}
    ${attributes}=    UTIL_BrowserHelper.get-attribute-names    ${selector}
    ${contains}=    UTIL_Collection.check-value-exists-in-list    ${attributes}    ${attribute_name}
    IF    $contains
        TRY
            ${attribute}=    RPA.Browser.Playwright.Get Attribute    ${selector}    ${attribute_name}
            RETURN    ${attribute}
        EXCEPT    AS    ${error_message}
            Log To Console    ${error_message}    ERROR
            EX_Exception.ex-fail    INVALID_BROWSER_ELEMENT_ATTRIBUTE
        END
    END
    RETURN    '${EMPTY}'

get-attribute-names
    [Documentation]    Method used to get attribute names
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    OUTPUT: [string]
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}
    ${attributes}=    RPA.Browser.Playwright.Get Attribute Names    ${selector}
    RETURN    ${attributes}

is-enabled-after-wait
    [Documentation]    checks whether the given selector is enabled
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    OUTPUT: boolean
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}
    ${result}=    is-element-state-appear-after-wait    ${selector}    ${ELEMENT_STATE_ENABLED}
    RETURN    ${result}

is-visible-after-wait
    [Documentation]    checks whether the given selector is visible
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    OUTPUT: boolean
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}
    ${result}=    is-element-state-appear-after-wait    ${selector}    ${ELEMENT_STATE_VISIBLE}
    RETURN    ${result}

is-editable-after-wait
    [Documentation]    checks whether the given selector is editable
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    OUTPUT: boolean
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}
    ${result}=    is-element-state-appear-after-wait    ${selector}    ${ELEMENT_STATE_EDITABLE}
    RETURN    ${result}

is-attached-after-wait
    [Documentation]    checks whether the given selector is attached to the DOM
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${selector}
    TRY
        ${result}=    is-element-state-appear-after-wait    ${selector}    ${ELEMENT_STATE_ATTACHED}
        RETURN    ${result}
    EXCEPT
        RETURN    ${False}
    END

is-hidden-after-wait
    [Documentation]    checks whether the given selector is hidden
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...
    ...    OUTPUT: boolean
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}
    ${result}=    is-element-state-appear-after-wait    ${selector}    ${ELEMENT_STATE_HIDDEN}
    RETURN    ${result}

is-element-state-appear-after-wait
    [Documentation]    Used to get the element state
    ...    after waiting for the element state
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${state}: string
    ...
    ...    OUTPUT: boolean
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    [Tags]    util
    [Arguments]    ${selector}    ${state}
    TRY
        ${result}=    Run Keyword And Return Status
        ...    RPA.Browser.Playwright.Wait For Elements State
        ...    ${selector}
        ...    ${state}
        ...    timeout=12s
        RETURN    ${result}
    EXCEPT    AS    ${error_message}
        Log To Console    Error while getting element state: ${error_message}    ERROR
        EX_Exception.ex-fail    ELEMENT_NOT_ATTACHED
    END

wait-until-network-is-idle
    [Documentation]    Method used to wait until network is idle
    ...
    ...    INPUT:
    ...    ${message}: string
    ...
    ...    THROWS:
    ...    LOADER_STILL_PRESENT/message
    [Tags]    util
    [Arguments]    ${message}=LOADER_STILL_PRESENT
    TRY
        Log To Console    Waiting for network to be idle    INFO
        RPA.Browser.Playwright.Wait Until Network Is Idle
        Log To Console    Network is idle    INFO
    EXCEPT    AS    ${error_message}
        Log To Console    Error while waiting for network idle: ${error_message}    ERROR
        EX_Exception.ex-fail    ${message}
    END

wait-for-body-to-stop-loading
    [Documentation]    Method used to wait until the body html stops loading
    [Tags]    util
    TRY
        Log To Console    <=== Waiting for body to stop loading ===>    INFO
        wait-for-element-change    //body    debounce=true
        Log To Console    <=== Body stops loading ===>    INFO
    EXCEPT    ELEMENT_NOT_ATTACHED_IN_CUSTOM_SLEEP
        Log To Console    Element is not attached to perform custom sleep    ERROR
        EX_Exception.ex-fail    ELEMENT_NOT_ATTACHED_IN_CUSTOM_SLEEP
    END

wait-for-element-change
    [Documentation]    custom sleep function: wait for particular
    ...    element to load fully , implemented with
    ...    js debounce and mutation observer
    ...
    ...    duration must be given in milliseconds
    ...
    ...    if debounce is set to true, it will wait for the element to become stable
    ...    if debounce is set to false, the this keyword will sleep till the first change
    ...
    ...    INPUT:
    ...    ${selector}: string
    ...    ${duration}: int
    ...    ${debounce}: true | false
    ...    ${error_message}: string
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED_IN_CUSTOM_SLEEP
    [Tags]    util
    [Arguments]
    ...    ${selector}
    ...    ${duration}=5000
    ...    ${debounce}=false
    ...    ${error_message}=ELEMENT_NOT_ATTACHED_IN_CUSTOM_SLEEP

    Log To Console    custom sleep started for element:${selector}    INFO
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}    ${error_message}
    Log To Console    element attached in the dom:${selector}    INFO
    TRY
        ${element_innerText}=    RPA.Browser.Playwright.Evaluate JavaScript
        ...    ${selector}
        ...    async (element) => new Promise((resolve, reject) => {
        ...    let observer;
        ...    const sendResponseAndDisconnect = () => {
        ...    resolve(element.innerText);
        ...    observer.disconnect();
        ...    console.log('Exit sleep...');
        ...    };
        ...    let timeoutId = setTimeout(() => {
        ...    console.log('Mutation not occured...');
        ...    sendResponseAndDisconnect();
        ...    }, ${duration});
        ...    const debounce = (func, delay) => {
        ...    let debounceTimer;
        ...    return function () {
        ...    const context = this;
        ...    const args = arguments;
        ...    clearTimeout(debounceTimer);
        ...    debounceTimer = setTimeout(() => func.apply(context, args), delay);
        ...    console.log('Debouncing...');
        ...    };
        ...    };
        ...    let summery = { addded: [], removed: [] };
        ...    const send = debounce(() => {
        ...    console.log('Mutation saturated after debounce...');
        ...    sendResponseAndDisconnect();
        ...    }, ${duration});
        ...    const log = mutations => {
        ...    if (timeoutId) {
        ...    clearTimeout(timeoutId);
        ...    timeoutId = null;
        ...    }
        ...    if (${debounce}) {
        ...    for (let mutation of mutations) {
        ...    for (let node of mutation.addedNodes) {
        ...    if (!(node instanceof HTMLElement)) continue;
        ...    summery = {
        ...    ...summery,
        ...    addded: [...summery.addded, node.outerHTML]
        ...    };
        ...    }
        ...    for (let node of mutation.removedNodes) {
        ...    if (!(node instanceof HTMLElement)) continue;
        ...    summery = {
        ...    ...summery,
        ...    removed: [...summery.removed, node.outerHTML]
        ...    };
        ...    }
        ...    }
        ...    send();
        ...    } else {
        ...    console.log('Mutation occured without debounce...');
        ...    sendResponseAndDisconnect();
        ...    }
        ...    };
        ...    observer = new MutationObserver(log);
        ...    observer.observe(element, { childList: true, subtree: true });
        ...    console.log("Observing element:", element);
        ...    console.log("Should debounce:", ${debounce});
        ...    });
        Log To Console    Custom sleep ended for the element:${selector}    INFO
    EXCEPT    AS    ${err_msg}
        Log To Console    Error inside custom sleep util: ${err_msg}    ERROR
    END

get-element-count
    [Documentation]    Method is used to get element count for given selector
    ...    INPUT:
    ...    ${selector}: String
    ...
    ...    THROWS:
    ...    UNABLE_TO_GET_ELEMENTS_COUNT
    [Tags]    util
    [Arguments]    ${selector}
    ${element_count}=    RPA.Browser.Playwright.Get Element Count    ${selector}
    RETURN    ${element_count}

check-if-element-selected-by-css
    [Documentation]    Methos is used to check the element is selected or not using css
    ...
    ...    INPUT:
    ...    ${selector}: String
    ...    ${css_property}: String
    ...    ${css_value}: String
    ...
    ...    THROWS:
    ...    ELEMENT_NOT_ATTACHED
    ...    UNABLE_TO_CHECK_ELEMENT_IS_SELECTED_OR_NOT
    [Tags]    util
    [Arguments]    ${selector}    ${css_property}=color    ${css_value}=rgb(16, 16, 16)
    UTIL_Validation.fail-if-not-attached-after-wait    ${selector}
    TRY
        &{style_dict}=    RPA.Browser.Playwright.Get Style    selector=${selector}
        ${is_element_selected}=    UTIL_String.compare-strings    ${style_dict}[${css_property}]    ${css_value}
        RETURN    ${is_element_selected}
    EXCEPT    AS    ${error_message}
        Log To Console    ${error_message}    ERROR
        EX_Exception.ex-fail    UNABLE_TO_CHECK_ELEMENT_IS_SELECTED_OR_NOT
    END
