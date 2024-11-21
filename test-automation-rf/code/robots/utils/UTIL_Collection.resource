*** Settings ***
Library     Collections


*** Keywords ***
util-check-key-exists
    [Documentation]    checks whether the key exists in dicitonary
    ...
    ...    INPUT:
    ...    ${dictionary}: dictionary
    ...    ${key}: string
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${dictionary}    ${key}
    ${is_key_exists}=    Run Keyword And Return Status    dictionary should contain key    ${dictionary}    ${key}
    RETURN    ${is_key_exists}

util-is-value-not-none
    [Documentation]    checks whether the key exists in dicitonary
    ...
    ...    INPUT:
    ...    ${dictionary}: dictionary
    ...    ${key}: string
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${dictionary}    ${key}
    ${no_none_exists}=    Run Keyword And Return Status    dictionary should contain key    ${dictionary}    ${key}
    IF    $no_none_exists == $True
        ${values}=    Set Variable    ${dictionary}[${key}]
        ${is_json}=    Evaluate    isinstance(${values},dict)
        IF    $is_json == $True
            IF    $values != $None
                ${no_none_exists}=    Set Variable    ${True}
            ELSE
                ${no_none_exists}=    Set Variable    ${False}
            END
        ELSE
            IF    $values != $None
                ${no_none_exists}=    Set Variable    ${True}
            ELSE
                ${no_none_exists}=    Set Variable    ${False}
            END
        END
    END
    RETURN    ${no_none_exists}

util-check-value-exists-in-list
    [Documentation]    Method used ckeck if the given list contains the item
    ...    Returns true if contains else false
    ...
    ...    INPUT:
    ...    ${list}: list
    ...    ${item}: any
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${list}    ${item}
    ${is_value_exists}=    Run Keyword And Return Status    List Should Contain Value    ${list}    ${item}
    RETURN    ${is_value_exists}

util-check-lists-are-equal
    [Documentation]    Method used ckeck if the given lists contains equal items
    ...    Returns true if contains else false
    ...
    ...    INPUT:
    ...    ${list1}: list
    ...    ${list2}: any
    ...
    ...    OUTPUT: boolean
    [Tags]    util
    [Arguments]    ${list1}    ${list2}
    ${is_equal}=    Run Keyword And Return Status    Lists Should Be Equal    ${list1}    ${list2}
    RETURN    ${is_equal}

util-find-common-items
    [Documentation]    Method used to return the common items present in both lists
    ...
    ...    INPUT:
    ...    ${list1}: list
    ...    ${list2}: list
    ...
    ...    OUTPUT: list
    [Tags]    util
    [Arguments]    ${list1}    ${list2}
    ${common_items}=    Create List
    FOR    ${item1}    IN    @{list1}
        FOR    ${item2}    IN    @{list2}
            IF    $item1 == $item2
                Append To List    ${common_items}    ${item1}
                BREAK
            END
        END
    END
    RETURN    ${common_items}

util-get-field-values
    [Documentation]    Method used to get the values as list for the particular field
    ...    from list fo dictionaries
    ...
    ...    INPUT:
    ...    ${list}: [{[string]: any}]
    ...    ${field}: string
    ...
    ...    OUTPUT: [any]
    [Tags]    util
    [Arguments]    ${list}    ${field}
    ${result}=    Create List
    FOR    ${dict}    IN    @{list}
        FOR    ${key}    IN    @{dict}
            IF    $key == $field
                Append To List    ${result}    ${dict}[${key}]
            END
        END
    END
    RETURN    ${result}

util-replace-list-of-dictionaries-keys-using-mapper
    [Documentation]    Method used to replace the list of dictionary keys with the given mapper
    ...
    ...    INPUT:
    ...    ${list}: [{[String]: any}]
    ...    ${mapper_dict}: [[String]: [String]]
    ...    ${include_only_mapper_keys}: Boolean
    ...
    ...    OUTPUT:
    ...    ${new_list}: [[[String]: any]]
    [Tags]    util
    [Arguments]    ${list}    ${mapper_dict}    ${include_only_mapper_keys}=${False}
    ${new_list}=    Create List
    FOR    ${dict}    IN    @{list}
        ${new_dict}=    util-replace-dictionary-keys-using-mapper
        ...    ${dict}
        ...    ${mapper_dict}
        ...    ${include_only_mapper_keys}
        Append To List    ${new_list}    ${new_dict}
    END
    RETURN    ${new_list}

util-replace-dictionary-keys-using-mapper
    [Documentation]    Method used to replace the dictionary keys with the given mapper
    ...
    ...    INPUT:
    ...    ${dict}: {[String]: any}
    ...    ${mapper_dict}: [[String]: [String]]
    ...    ${include_only_mapper_keys}: Boolean
    ...
    ...    OUTPUT:
    ...    ${new_dict}: [[String]: any]
    [Tags]    util
    [Arguments]    ${dict}    ${mapper_dict}    ${include_only_mapper_keys}=${False}
    ${new_dict}=    Create Dictionary
    FOR    ${old_key}    IN    @{dict}
        ${key_exists}=    UTIL_Collection.util-check-key-exists    ${mapper_dict}    ${old_key}
        IF    $include_only_mapper_keys
            IF    ${key_exists}
                Set To Dictionary    ${new_dict}    ${mapper_dict}[${old_key}]=${dict}[${old_key}]
            END
        ELSE
            ${new_key}=    Set Variable If    ${key_exists}    ${mapper_dict['${old_key}']}    ${old_key}
            Set To Dictionary    ${new_dict}    ${new_key}=${dict}[${old_key}]
        END
    END
    RETURN    ${new_dict}

util-is-list-empty
    [Documentation]    Method used to check if the list is empty or not and return boolean
    ...
    ...    INPUT:
    ...    ${lists}: [{Object}]
    ...
    ...    OUTPUT:
    ...    ${is_empty}: boolean
    [Tags]    util
    [Arguments]    ${lists}
    ${count}=    Get Length    ${lists}
    RETURN    ${count == ${0}}

util-check-dict-has-same-value
    [Documentation]    Method used to check if the all values in a dictionary are same given value
    ...
    ...    INPUT:
    ...    ${dictionary}: {Object}
    ...    ${value}: any
    ...
    ...    OUTPUT:
    ...    ${result}: boolean
    [Tags]    util
    [Arguments]    ${dict}    ${value}
    ${dict_values}=    Get Dictionary Values    ${dict}
    ${result}=    Set Variable    ${False}
    FOR    ${element}    IN    @{dict_values}
        ${result}=    Run Keyword And Return Status    Should Be Equal    ${value}    ${element}
        IF    $result == $False    BREAK
    END
    RETURN    ${result}

util-check-dictionary-is-empty
    [Documentation]    Method used to check if dictionary is empty or not
    ...
    ...    INPUT:
    ...    ${dictionary}: {Object}
    ...
    ...    OUTPUT:
    ...    ${is_empty}: boolean
    ...
    [Tags]    util
    [Arguments]    ${dict}
    ${dict_values}=    Get Dictionary Values    ${dict}
    ${dict_length}=    Get Length    ${dict_values}
    ${is_empty}=    Set Variable    ${False}
    IF    '${dict_length}' == '0'
        ${is_empty}=    Set Variable    ${True}
    END
    RETURN    ${is_empty}

util-merge-dictionaries
    [Documentation]    Method used to add the dictionaries values into the first dictionary
    ...    Note – If two keys with the same name exist,
    ...    the value of the latter key is included in the merged dictionary
    [Tags]    util
    [Arguments]    ${dict1}    ${dict2}
    FOR    ${key}    IN    @{dict2}
        Set To Dictionary    ${dict1}    ${key}=${dict2}[${key}]
    END
    RETURN    ${dict1}
