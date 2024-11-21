*** Settings ***
Library     RPA.Browser.Playwright
Library     OperatingSystem
Resource    ../../utils/UTIL_Validation.resource
Resource    ../../utils/exceptions/EX_Exception.resource
Resource    ../../utils/UTIL_BrowserHelper.resource
Resource    ../../utils/UTIL_String.resource


*** Keywords ***
launch-browser
    [Arguments]    ${url}    ${browser_timeout}=20s
    RPA.Browser.Playwright.New Persistent Context
    ...    browser=chromium
    ...    headless=False
    RPA.Browser.Playwright.Set Browser Timeout    ${browser_timeout}
    RPA.Browser.Playwright.New Page    ${url}
