*** Settings ***
Library     RPA.Browser.Playwright
Library     String


*** Keywords ***
util-compare-strings
    [Documentation]    Method used to compare the strings
    ...
    ...    INPUT:
    ...    ${string1}: string
    ...    ${string2}: string
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${string1}    ${string2}
    ${result}=    RPA.Browser.Playwright.Evaluate JavaScript
    ...    ${None}
    ...    () => `${string1}` === `${string2}`
    RETURN    ${result}

util-check-string-contains
    [Documentation]    Method used to check if string1 contains string2
    ...
    ...    INPUT:
    ...    ${string1}: string
    ...    ${string2}: string
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${string1}    ${string2}
    ${result}=    RPA.Browser.Playwright.Evaluate JavaScript
    ...    ${None}
    ...    () => `${string1}`.includes(`${string2}`)
    RETURN    ${result}

util-check-string-contains-all-substrings
    [Documentation]    Method used to check if string1 contains all substrings
    ...
    ...    INPUT:
    ...    ${string}: string
    ...    ${substrings}: [string]
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${string}    @{substrings}
    ${result}=    RPA.Browser.Playwright.Evaluate JavaScript
    ...    ${None}
    ...    () => ${substrings}.every(substring => `${string}`.includes(substring))
    RETURN    ${result}

util-check-string-contains-any-substring
    [Documentation]    Method used to check if string1 contains any substring
    ...
    ...    INPUT:
    ...    ${string}: string
    ...    ${substrings}: [string]
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${string}    @{substrings}
    ${result}=    RPA.Browser.Playwright.Evaluate JavaScript
    ...    ${None}
    ...    () => ${substrings}.some(substring => `${string}`.includes(substring))
    RETURN    ${result}

util-check-and-enclose-with-quote
    [Documentation]    Method used to enclose the string with single quotes
    ...    if the string contains double quotes
    ...    else encloses with double quotes
    ...
    ...    INPUT:
    ...    ${string}: string
    ...
    ...    OUTPUT: string
    [Tags]    util
    [Arguments]    ${string}
    ${result}=    RPA.Browser.Playwright.Evaluate JavaScript
    ...    ${None}
    ...    () => `${string}`.indexOf(`"`) > -1 ? `'${string}'` : `"${string}"`
    RETURN    ${result}
