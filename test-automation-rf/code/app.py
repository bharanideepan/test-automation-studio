"""
    App.py : contains methods to start the program
"""
import re
import robot
import robot.libraries
from robot.libraries.BuiltIn import BuiltIn

def invoke_fb_worker():
        run_result = robot.run("./robots/start.robot")
        print(run_result)
        return run_result



if __name__ == "__main__":
    run_result = invoke_fb_worker()
   