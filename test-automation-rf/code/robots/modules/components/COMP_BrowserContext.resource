*** Settings ***
Library     RPA.Browser.Playwright
Library     OperatingSystem


*** Keywords ***
launch-browser
    [Arguments]    ${url}=${None}    ${browser_timeout}=20s
    New Browser    chromium    headless=False
    New Context    viewport={'width': 1280, 'height': 720}    acceptDownloads=True
    RPA.Browser.Playwright.Set Browser Timeout    ${browser_timeout}
    ${page_id}=    RPA.Browser.Playwright.New Page    https://www.google.com/
    # RPA.Browser.Playwright.Switch Page    ${page_id}

new-page
    [Arguments]    ${url}
    ${page_id}=    RPA.Browser.Playwright.New Page    ${url}
    RPA.Browser.Playwright.Switch Page    ${page_id}

close-browser
    TRY
        RPA.Browser.Playwright.Close Browser
    EXCEPT    AS    ${err}
        Log To Console    Error while closing browser: ${err}
    END