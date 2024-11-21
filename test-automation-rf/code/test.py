import websocket
import json
import time

is_terminated = False  # Global flag to track termination

def execute_robot_keywords(run_id, test_case_id):
    """Simulate executing Robot Framework steps."""
    global is_terminated
    steps = [
        {"keyword": "Step 1: Open Browser", "time": 2},
        {"keyword": "Step 2: Input Text", "time": 3},
        {"keyword": "Step 3: Click Button", "time": 2},
        {"keyword": "Step 4: Close Browser", "time": 1},
    ]

    for step in steps:
        if is_terminated:
            print("Execution terminated.")
            ws.send(json.dumps({
                "event": "step_update",
                "runId": run_id,
                "message": "Execution terminated by user."
            }))
            break

        print(f"Executing: {step['keyword']}")
        time.sleep(step["time"])
        ws.send(json.dumps({
            "event": "step_update",
            "runId": run_id,
            "message": step["keyword"]
        }))

def on_message(ws, message):
    global is_terminated
    data = json.loads(message)

    if "start_run" in data:
        run_id = data["runId"]
        test_case_id = data["testCaseId"]
        is_terminated = False  # Reset termination flag for new runs
        execute_robot_keywords(run_id, test_case_id)

    elif "terminate_run" in data:
        run_id = data["runId"]
        print(f"Termination request received for run {run_id}")
        is_terminated = True

def on_open(ws):
    print("Connected to Node.js server")

def on_close(ws, close_status_code, close_msg):
    print("Disconnected from Node.js server")

if __name__ == "__main__":
    ws = websocket.WebSocketApp(
        "ws://localhost:3000/python",
        on_open=on_open,
        on_message=on_message,
        on_close=on_close
    )
    ws.run_forever()
