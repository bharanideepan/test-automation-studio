def get_selected_input(flow_action_sequence):
    if not flow_action_sequence.get("testCaseFlowSequenceActionInput"):
        return next((input for input in flow_action_sequence["action"]["inputs"] if input.get("isDefault")), None)
    
    if flow_action_sequence["testCaseFlowSequenceActionInput"].get("defaultInput"):
        return next((input for input in flow_action_sequence["action"]["inputs"] if input.get("isDefault")), None)
    
    return next(
        (input for input in flow_action_sequence["action"]["inputs"] 
         if input.get("id") == flow_action_sequence["testCaseFlowSequenceActionInput"].get("inputId")), 
        None
    )
